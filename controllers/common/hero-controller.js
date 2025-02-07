const Hero = require("../../models/Hero");
const { handleImageUpload, deleteImage } = require("../../helpers/cloudinary");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../../errors')

const addHeroImage = async (req, res) => {
  const img = await handleImageUpload(req)

  const HeroImage = new Hero({
    ...img
  });

  await HeroImage.save();
  const response = new ApiResponse(
    {
      statusCode: StatusCodes.CREATED,
      success: true,
      msg: "Hero image added successfully",
      data: null,
    }
  );
  res.status(response.statusCode).json(response);
};
const changeHeroImageActive = async (req, res) => {

  const { id } = req.params;
  let heroImage = await Hero.findById(id);
  if (!heroImage)
    throw new NotFoundError("Hero image can not be found")

  const HeroImage = await Hero.findById(id);

  HeroImage.active = !HeroImage.active
  await HeroImage.save();

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Hero image activity changed successfully",
      data: null,
    }
  );
  res.status(response.statusCode).json(response);
};

const getHeroImage = async (req, res) => {

  const { active } = req.params;
  let heroImage;

  if (active === 'active') {
    heroImage = await Hero.find({ active: true });
  } else {
    heroImage = await Hero.find();
  }


  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Hero images retrieved successfully",
      data: heroImage,
    }
  );
  res.status(response.statusCode).json(response);
};


//delete a product
const deleteHeroImage = async (req, res) => {

  const { id } = req.params;
  let heroImage = await Hero.findOne({ public_id: id });
  if (!heroImage)
    throw new NotFoundError("Hero image can not be found")
  const ress = await deleteImage(heroImage.public_id)
  if (ress.result === 'ok') {
    await Hero.deleteOne({ public_id: id });
  }
  else {
    throw new BadRequestError('Failed to delete image')
  }

  const response = new ApiResponse(
    {
      statusCode: StatusCodes.OK,
      success: true,
      msg: "Hero image deleted successfully",
      data: null,
    }
  )
  res.status(response.statusCode).json(response);
};


module.exports = { addHeroImage, getHeroImage, deleteHeroImage, changeHeroImageActive };
