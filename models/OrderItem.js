const mongoose = require("mongoose"); // for database

// ORDERITEM SCHEMA - BLUE PRINT OF ORDERITEM DATA
const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    require: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    // require: true,
    ref: "Product",
  },
});

// VIRTUAL
orderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderItemSchema.set("toJSON", { virtuals: true });

// ORDERITEM MODEL
exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);
