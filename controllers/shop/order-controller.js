const axios = require("axios")
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Address = require("../../models/Address");
const Product = require("../../models/Product");
const User = require("../../models/User");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../../errors')
require("dotenv").config();

const createPayment = async (amount, itemsArr, home, userId) => {
  const user = await User.findById(userId)

  // 1. Authenticate and get token
  const authResponse = await axios.post(`${process.env.BASE_URL}/auth/tokens`, {
    api_key: process.env.Paymob_API_KEY,
  });
  const token = authResponse.data.token;

  // 2. Create an order
  const orderResponse = await axios.post(
    `${process.env.BASE_URL}/ecommerce/orders`,
    {
      merchant_id: authResponse.data.profile.id,
      amount_cents: amount * 100, // Convert amount to cents
      currency: 'EGP',
      items: [],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const orderId = orderResponse.data.id;

  // 3. Generate a payment key
  const paymentKeyResponse = await axios.post(
    `${process.env.BASE_URL}/acceptance/payment_keys`,
    {
      auth_token: token,
      amount_cents: amount * 100,
      currency: 'EGP',
      order_id: orderId,
      billing_data: {
        apartment: '803',
        email: user.email,
        floor: '42',
        first_name: 'Sir',
        street: home.address,
        building: '8028',
        phone_number: home.phone,
        shipping_method: 'PKG',
        postal_code: '01898',
        city: home.city,
        country: 'EG',
        last_name: user.userName,
        state: home.city,
      },
      integration_id: process.env.integration_id,
    },
    { timeout: 10000 }
  );

  const paymentKey = paymentKeyResponse.data.token;

  // 4. Redirect user to Paymob's payment page
  return { url: `${process.env.BASE_URL}/acceptance/iframes/894032?payment_token=${paymentKey}`, orderId: orderId };

}


const createOrder = async (req, res) => {
  if (!req.user) {
    throw new UnauthenticatedError("Invalid Access")
  }
  const userId = req.user.userId

  const { addressInfo, cartItems, cartId } = req.body

  // Check if there is enough stock for all items in the cart and deduce them
  for (let item of cartItems) {
    let product = await Product.findById(item.productId);
    if (product.totalStock < item.quantity) {
      throw new BadRequestError(`Not enough stock for this product ${product.title}, buy another product instead`);
    }
    product.totalStock -= item.quantity;
    await product.save();
  }

  let totalAmount = 0;
  let price;
  for (const item of cartItems) {
    if (!item.productId.salePrice)
      price = item.productId.price
    else
      price = item.productId.salePrice;

    totalAmount += price * item.quantity;  // Add price * quantity to total amount
  }

  const { url, orderId } = await createPayment(totalAmount, cartItems, addressInfo, userId)

  const newlyCreatedOrder = new Order({
    customerId: userId,
    cartItems: cartItems,
    addressInfo: addressInfo.addressId,
    orderStatus: "Pending",
    orderId: orderId,
    paymentURL: url,
    totalAmount: totalAmount
  });

  await newlyCreatedOrder.save();

  // Remove cart items from cart
  await Cart.findByIdAndDelete(cartId)

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.CREATED,
      success: true,
      msg: "Order created successfully",
      data: {
        order: newlyCreatedOrder,
        paymentUrl: url
      },
    }
  );
  res.status(response.statusCode).json(response);


};

const getAllOrdersByUser = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  if (!req.user) {
    throw new UnauthenticatedError("Invalid Access")
  }
  const userId = req.user.userId
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  // Validate page and limit
  if (pageNumber < 1 || pageSize < 1) {
    throw new BadRequestError("Invalid page or limit");
  }
  const orders = await Order.find({ customerId: userId })
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec();
  // Get total number of books for pagination info
  const totalOrders = await Order.countDocuments({ customerId: userId }).exec();

  if (!orders || orders.length === 0) {
    throw new BadRequestError("No orders found");
  }

  const response = new ApiResponse({
    msg: "Orders fetched successfully",
    data: {
      orders,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders,
      },
    },
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
};

const getOrderDetails = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate("customerId", "userName email")
    .populate("cartItems.productId", "title price salePrice")
    .populate("addressInfo", "address city postcode phone notes");

  if (!order) {
    throw new NotFoundError("Order can not be found")
  }

  const response = new ApiResponse({
    msg: "order fetched successfully",
    data: order,
    success: true,
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
};
