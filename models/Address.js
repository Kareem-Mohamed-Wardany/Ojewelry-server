const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Please provide your full address"],
    },
    city: {
      type: String,
      required: [true, "Please provide your city"],
    },
    postcode: {
      type: String,
      required: [true, "Please provide your Postal Code"],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
