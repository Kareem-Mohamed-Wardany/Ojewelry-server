const { handleImageUpload, deleteImage } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../../errors')

// Add a new product
const addProduct = async (req, res) => {
  const { title, category, material, price, totalStock } = req.body;

  // Validate required fields
  if (!title || !category || !material || !price || !totalStock) {
    throw new BadRequestError('Missing required data');
  }

  // Upload image to Cloudinary
  const { image, public_id } = await handleImageUpload(req);
  if (!image) {
    throw new BadRequestError('Failed to upload image');
  }

  // Assign image URL and public ID to product data
  req.body.image = image;
  req.body.public_id = public_id;

  // Create the product in database
  await Product.create({ ...req.body });

  const response = new ApiResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    msg: "Product added successfully",
    data: null,
  });

  res.status(response.statusCode).json(response);
};

// Fetch all products with pagination
const fetchAllProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = Number(page);
  const pageSize = Number(limit);

  // Validate page and limit values
  if (pageNumber < 1 || pageSize < 1) {
    throw new BadRequestError("Invalid page or limit");
  }

  // Fetch products with pagination
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec();

  // Get total number of products for pagination info
  const totalProducts = await Product.countDocuments().exec();

  if (!products || products.length === 0) {
    throw new BadRequestError("No products found");
  }

  // Send paginated response
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

// Edit a product
const editProduct = async (req, res) => {
  const { _id, title, category, material, price, salePrice, totalStock } = req.body;

  let findProduct = await Product.findById(_id);

  if (!findProduct) throw new NotFoundError("Product cannot be found");

  // If image is updated, delete old image from Cloudinary and upload new one
  if (req.file) {
    const result = await deleteImage(findProduct.public_id);
    if (result.result === 'ok') {
      const uploadedResult = await handleImageUpload(req);
      if (!uploadedResult.url) {
        throw new BadRequestError('Failed to upload image');
      }
      findProduct.image = uploadedResult.url;
    }
  }

  // Update product fields
  findProduct.title = title || findProduct.title;
  findProduct.category = category || findProduct.category;
  findProduct.material = material || findProduct.material;
  findProduct.price = price || findProduct.price;
  findProduct.salePrice = salePrice || findProduct.salePrice;
  findProduct.totalStock = totalStock || findProduct.totalStock;

  await findProduct.save();

  const response = new ApiResponse({
    statusCode: StatusCodes.OK,
    success: true,
    msg: "Product edited successfully",
    data: findProduct,
  });

  res.status(response.statusCode).json(response);
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  let findProduct = await Product.findById(id);

  if (!findProduct) throw new NotFoundError("Product cannot be found");

  // Delete image from Cloudinary and the product from DB
  const result = await deleteImage(findProduct.public_id);
  if (result.result === 'ok') {
    await Product.deleteOne({ _id: id });
  } else {
    throw new BadRequestError('Failed to delete image');
  }

  const response = new ApiResponse({
    statusCode: StatusCodes.OK,
    success: true,
    msg: "Product deleted successfully",
    data: null,
  });

  res.status(response.statusCode).json(response);
};

module.exports = {
  addProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
};
