const ApiResponse = require("../../custom-response/ApiResponse");
const Product = require("../../models/Product");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../../errors')
const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {

  // TODO add pagination
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  // Validate page and limit
  if (pageNumber < 1 || pageSize < 1) {
    throw new BadRequestError("Invalid page or limit");
  }
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec();
  // Get total number of books for pagination info
  const totalOrders = await Order.countDocuments().exec();

  if (!orders || orders.length === 0) {
    throw new BadRequestError("No orders found");
  }

  const response = new ApiResponse({
    msg: "Products fetched successfully",
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

const getOrderDetailsForAdmin = async (req, res) => {

  const { id } = req.params;

  const order = await Order.findById(id).select("-paymentURL")
    .populate("customerId", "userName email")
    .populate("cartItems.productId", "title price salePrice")
    .populate("addressInfo", "address city postcode phone notes");

  if (!order)
    throw new NotFoundError("Order not found!")


  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Order details retrieved successfully",
      data: order,
    }
  );
  res.status(response.statusCode).json(response);
};

const updateOrderStatus = async (req, res) => {

  const { id } = req.params;
  const { orderStatus } = req.body;

  const order = await Order.findById(id);

  if (!order) throw new NotFoundError("Order not found!")
  if (orderStatus === "Declined") {
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);
      product.totalStock += item.quantity;
      await product.save();
    }
  }

  await Order.findByIdAndUpdate(id, { orderStatus });

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Order status updated successfully",
      data: order,
    }
  );
  res.status(response.statusCode).json(response);
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
