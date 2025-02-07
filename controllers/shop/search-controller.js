const Product = require("../../models/Product");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../../errors')

const searchProducts = async (req, res) => {

  const { keyword, page = 1, limit = 10 } = req.params;
  if (!keyword || typeof keyword !== "string") {
    throw new BadRequestError("Keyword is required and must be in string format");
  }

  const regEx = new RegExp(keyword, "i");

  const createSearchQuery = {
    $or: [
      { title: regEx },
      { description: regEx },
      { category: regEx },
      { brand: regEx },
    ],
  };
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  // Validate page and limit
  if (pageNumber < 1 || pageSize < 1) {
    throw new BadRequestError("Invalid page or limit");
  }
  const products = await Product.find(createSearchQuery)
    .sort({ createdDate: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec();
  console.log(products);
  // Get total number of books for pagination info
  const totalProducts = await Product.countDocuments(createSearchQuery).exec();

  if (!products || products.length === 0) {
    throw new BadRequestError("No products found");
  }

  const response = new ApiResponse({
    msg: "Products fetched successfully",
    data: {
      products,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / pageSize),
        totalProducts,
      },
    },
    statusCode: StatusCodes.OK,
  });

  res.status(response.statusCode).json(response);
};

module.exports = { searchProducts };
