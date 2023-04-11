const mongoose = require("mongoose"); // for database

// CATEGORY SCHEMA - BLUE PRINT OF CATEGORY DATA
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});

// VIRTUAL
categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
categorySchema.set("toJSON", { virtuals: true });

// CATEGORY MODEL
exports.Category = mongoose.model("Category", categorySchema);
