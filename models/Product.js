
const mongoose = require("mongoose"); // for database

//  PRODUCT SCHEMA- BLUE PRINT OF PRODUCT DATA
const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  richDescription: {
    type: String,
    default: " ",
  },
  image: {
    type: String,
    default: " ",
  },
  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    default: " ",
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Category",
  },

  countInStore: {
    type: Number,
    require: true,
    min: 0,
    max: 255,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// VIRTUAL - DUPLICATE ID
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", { virtuals: true });

// PRODUCT MODEL 
exports.Product = mongoose.model("Product", productSchema);
