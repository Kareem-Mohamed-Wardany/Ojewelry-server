const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../../errors')

const addProductReview = async (req, res) => {
  const { productId, reviewMessage, reviewValue } =
    req.body;
  console.log(productId)
  if (!req.user) {
    throw new UnauthenticatedError("Invalid Access")
  }
  const userId = req.user.userId
  if (!reviewMessage || !reviewValue) {
    throw new BadRequestError("Please fill all fields")
  }


  const order = await Order.findOne({
    customerId: userId,
    "cartItems.productId": productId,
    orderStatus: { $ne: "Declined" },
  })
  console.log(order)
  if (!order) {
    throw new NotFoundError("You need to purchase that product to review it.")
  }

  if (order.orderStatus === "Accepted" || order.orderStatus === "Shipping") {
    throw new BadRequestError("You need to wait for that product to be delivered to review it.")
  }

  if (order.orderStatus === "Pending") {
    throw new BadRequestError("You need to pay the order.")
  }

  const checkExistingReview = await ProductReview.findOne({
    productId,
    userId,
  });

  if (checkExistingReview) {
    throw new BadRequestError("You already reviewed this product!")
  }

  const newReview = new ProductReview({
    productId,
    userId,
    reviewMessage,
    reviewValue,
  });

  await newReview.save();

  const reviews = await ProductReview.find({ productId });
  const totalReviewsLength = reviews.length;
  const averageReview =
    reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
    totalReviewsLength;

  await Product.findByIdAndUpdate(productId, { averageReview });

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.CREATED,
      success: true,
      msg: "Review added successfully",
      data: null,
    }
  );
  res.status(response.statusCode).json(response);
};

const getProductReviews = async (req, res) => {
  const { productId, page = 1, limit = 5 } = req.query;
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  // Validate page and limit
  if (pageNumber < 1 || pageSize < 1) {
    throw new BadRequestError("Invalid page or limit");
  }
  const reviews = await ProductReview.find({ productId: productId })
    .populate("userId", "userName")
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec();

  if (!reviews || reviews.length === 0) {
    throw new NotFoundError("No reviews found for this product");
  }
  const totalReviews = await ProductReview.countDocuments({ productId }).exec();

  const response = new ApiResponse({
    msg: "Products fetched successfully",
    data: {
      reviews,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalReviews / pageSize),
        totalReviews,
      },
    },
    statusCode: StatusCodes.OK,
  });

  res.status(response.statusCode).json(response);

};

module.exports = { addProductReview, getProductReviews };
