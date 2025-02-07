const Address = require("../../models/Address");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../../errors')

const addAddress = async (req, res) => {

  const { userId, address, city, postcode, phone, notes } = req.body;

  if (!address || !city || !postcode || !phone || !notes) {
    throw new BadRequestError("Please provide all fields")
  }

  const newlyCreatedAddress = new Address({ ...req.body });

  await newlyCreatedAddress.save();

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.CREATED,
      success: true,
      msg: "Address created successfully",
      data: newlyCreatedAddress,
    }
  );
  res.status(response.statusCode).json(response);


};

const fetchAllAddress = async (req, res) => {

  const { userId } = req.user;
  if (!userId) {
    throw new UnauthenticatedError("Invalid User")
  }

  const addressList = await Address.find({ userId });

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Address retrieved successfully",
      data: addressList,
    }
  );
  res.status(response.statusCode).json(response);

};

const editAddress = async (req, res) => {

  const { userId, addressId } = req.params;
  const formData = req.body;

  if (!userId || !addressId) {
    throw new BadRequestError("Please provide data")
  }

  const address = await Address.findOneAndUpdate(
    {
      _id: addressId,
      userId,
    },
    formData,
    { new: true }
  );

  if (!address) {
    throw new NotFoundError("Address can not be found")
  }

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Address updated successfully",
      data: address,
    }
  );
  res.status(response.statusCode).json(response);
};

const deleteAddress = async (req, res) => {

  const { userId, addressId } = req.params;
  if (!userId || !addressId) {
    throw new BadRequestError("Please provide data");
  }

  const address = await Address.findOneAndDelete({ _id: addressId, userId });
  if (!address) {
    throw new NotFoundError("Address can not be found")
  }

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Address deleted successfully",
      data: address,
    }
  );
  res.status(response.statusCode).json(response);
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
