const Product = require("../../models/Product");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../../errors')

const getFilteredProducts = async (req, res) => {
  const {
    category = "",        // Comma-separated string of categories
    material = "",        // Comma-separated string of materials
    sortBy = "price-lowtohigh", // Default sorting
    page = 1,             // Default page number
    limit = 10            // Default number of products per page
  } = req.query;

  // Parse category and material into arrays (if provided as comma-separated strings)
  const categoryArray = category ? category.split(",") : [];
  const materialArray = material ? material.split(",") : [];

  // Build filters object
  let filters = {};
  if (categoryArray.length) {
    filters.category = { $in: categoryArray };
  }
  if (materialArray.length) {
    filters.material = { $in: materialArray };
  }

  // Sorting logic
  let sort = {};
  switch (sortBy) {
    case "price-lowtohigh":
      sort.price = 1; // Ascending price
      break;
    case "price-hightolow":
      sort.price = -1; // Descending price
      break;
    case "title-atoz":
      sort.title = 1; // Alphabetical order
      break;
    case "title-ztoa":
      sort.title = -1; // Reverse alphabetical order
      break;
    default:
      sort.price = 1; // Default to sorting by price ascending
      break;
  }

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  ;


  try {
    // Add pagination to the query
    const products = await Product.find(filters)
      .sort(sort)  // Apply sorting
      .skip((pageNumber - 1) * pageSize) // Skip documents for previous pages
      .limit(pageSize) // Limit to the specified number of products
      .exec();

    // Get the total count of products that match the filters
    const totalProducts = await Product.countDocuments(filters);

    // Construct the response
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

    // Send the response
    res.status(response.statusCode).json(response);

  } catch (error) {
    // Handle any errors
    const response = new ApiResponse({
      msg: "Error fetching products",
      data: { error: error.message },
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
    res.status(response.statusCode).json(response);
  }
};


const getProductDetails = async (req, res) => {

  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product)
    throw new NotFoundError("Product can not be found")
  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Product details retrieved successfully",
      data: product,
    }
  );
  res.status(response.statusCode).json(response);


};

module.exports = { getFilteredProducts, getProductDetails };
