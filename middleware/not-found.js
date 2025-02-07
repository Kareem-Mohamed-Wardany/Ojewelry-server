const ApiResponse = require('../custom-response/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const response = new ApiResponse({
    msg: 'Route does not exist',
    data: null,
    success: false,
    statusCode: StatusCodes.NOT_FOUND,
  });
const notFound = (req, res) => res.status(404).json(response)

module.exports = notFound
