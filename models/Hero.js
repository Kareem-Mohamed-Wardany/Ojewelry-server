const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Please provide image"],
    },
    active: {
      type: Boolean,
      default: true,
      required: [true, "Please provide active status"]
    },
    public_id:
    {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", HeroSchema);
