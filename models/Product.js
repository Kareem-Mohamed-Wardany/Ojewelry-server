const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Please provide image"],
    },
    public_id: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Please provide title"]
    },
    category: {
      type: String,
      required: [true, "Please provide category"]
    },
    material: {
      type: String,
      required: [true, "Please provide material"]
    },
    price: {
      type: Number,
      required: [true, "Please provide price"]
    },
    salePrice: {
      type: Number,
    },
    totalStock: {
      type: Number,
      required: [true, "Please provide total Stock"]
    },
    averageReview: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
