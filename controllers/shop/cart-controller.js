const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../../errors')


const addToCart = async (req, res) => {

  const id = req.user.userId;
  const { productId, quantity } = req.body;


  if (!productId || quantity <= 0) {
    throw new BadRequestError("Please provide valid data");
  }

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product cannot be found");
  }

  // Find the user's cart
  let cart = await Cart.findOne({ userId: id });

  // If no cart is found, create a new one
  if (!cart) {
    cart = new Cart({
      userId: id,
      items: [
        {
          productId: productId,
          quantity: quantity,
        },
      ],
    });
  } else {
    // Cart exists, check if the items array is empty or if the product is already in the cart
    if (cart.items.length > 0) {
      const findCurrentProductIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      // If the product is already in the cart, update its quantity
      if (findCurrentProductIndex !== -1) {
        cart.items[findCurrentProductIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it to the items array
        const newItem = { productId: productId, quantity: quantity };
        cart.items.push(newItem);
      }
    } else {
      // If the cart has no items (empty array), add the first item
      const newItem = { productId: productId, quantity: quantity };
      cart.items.push(newItem);
    }
  }

  // Save the updated cart
  await cart.save();

  // Send response
  const response = new ApiResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    msg: "Product added successfully",
    data: cart,
  });
  res.status(response.statusCode).json(response);
};


const fetchCartItems = async (req, res) => {

  if (!req.user) {
    throw new UnauthenticatedError("Invalid Access")
  }
  const userId = req.user.userId

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) {
    throw new NotFoundError("No products in cart")
  }
  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "cart retrieved successfully",
      data: cart,
    }
  );
  res.status(response.statusCode).json(response);


};

const updateCartItemQty = async (req, res) => {
  if (!req.user) {
    throw new UnauthenticatedError("Invalid Access")
  }
  const userId = req.user.userId
  const { productId, quantity } = req.body;

  if (!productId || quantity <= 0) {
    throw new BadRequestError("Invalid data")
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new NotFoundError("Cart can not be found")
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    throw new NotFoundError("product can not be found")
  }

  cart.items[findCurrentProductIndex].quantity = quantity;
  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "cart updated successfully",
      data: cart,
    }
  );
  res.status(response.statusCode).json(response);
};

const deleteCartItem = async (req, res) => {
  if (!req.user) {
    throw new UnauthenticatedError("Invalid Access")
  }
  const userId = req.user.userId
  const { productId } = req.params;
  if (!productId) {
    throw new BadRequestError("Invalid data")
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) {
    throw new NotFoundError("Cart can not be found")
  }

  cart.items = cart.items.filter(
    (item) => item.productId._id.toString() !== productId
  );

  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });
  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "cart updated successfully",
      data: cart,
    }
  );
  res.status(response.statusCode).json(response);

};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
