const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number
      },
    },
  ],
  addressInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  orderStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Accepted", "Declined", "Shipping", "Delivered"]
  },
  orderId: {
    type: String
  },
  totalAmount: {
    type: Number
  },
  paymentURL: {
    type: String
  }
}, { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
