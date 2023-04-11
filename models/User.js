const mongoose = require("mongoose"); // for database

// User SCHEMA - blue print of the json data
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: " ",
  },
  apartment: {
    type: String,
    default: " ",
  },
  zipCode: {
    type: String,
    default: " ",
  },
  city: {
    type: String,
    default: " ",
  },
  country: {
    type: String,
    default: " ",
  },
});

// VIRTUAL
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", { virtuals: true });

// USER MODEL
exports.User = mongoose.model("User", userSchema);
