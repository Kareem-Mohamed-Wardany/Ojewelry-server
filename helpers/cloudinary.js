const cloudinary = require("cloudinary").v2;
const ApiResponse = require("../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});




const handleImageUpload = async (req) => {
  if (!req.file) {
    throw new BadRequestError('No image provided')
  }
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const url = "data:" + req.file.mimetype + ";base64," + b64;
  const out = await imageUploadUtil(url);
  return { image: out.secure_url, public_id: out.public_id };
};



async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const deleteImage = async (publicId) => {
  // Delete the image using its public ID
  return await cloudinary.uploader.destroy(publicId);

};

module.exports = { handleImageUpload, deleteImage };
