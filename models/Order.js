const mongoose = require("mongoose"); // for database

// ORDER SCHEMA - BLUE PRINT OF ORDER DATA
const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "OrderItem",
    },
  ],
  shippingAddress: {
    type: String,
    require: true,
  },
  shippingAddress2: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  zipCode: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
    default: "pending",
  },
  totalPrice: {
    type: Number,
    default: 0.0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

// VIRTUAL
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderSchema.set("toJSON", { virtuals: true });

// CATEGORY MODEL
exports.Order = mongoose.model("Order", orderSchema);
