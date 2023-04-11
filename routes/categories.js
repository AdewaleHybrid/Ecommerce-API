const express = require("express");
const router = express.Router();
const { Category } = require("../models/Category");
const mongoose = require("mongoose");

// GET ALL CATEGORIES
// GET: http://localhost:1999/api/v1/categories
router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ Succes: false });
  } else {
    res.send(categoryList);
  }
});

// GET ONE CATEGORY
// GET: http://localhost:1999/api/v1/categories/categoryID
router.get("/:categoryId", async (req, res) => {
  const par = req.params.categoryId;
  const category = await Category.findById(par);
  if (!category) {
    res.status(500).json({ message: "the category with cannot be found" });
  } else {
    res.status(200).send(category);
  }
});

// CREATE NEW CATEGORY
// POST: http://localhost:1999/api/v1/categories
router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();
  // check
  if (!category) {
    return res.status(404).send("The Category cannot be created");
  } else res.send(category);
});

// UPDATE A CATEGORY
// PUT: http://localhost:1999/api/v1/categories/categoryID
router.put("/:categoryId", async (req, res) => {
  const par = req.params.categoryId;
  const category = await Category.findByIdAndUpdate(par, { name: req.body.name, icon: req.body.icon, color: req.body.color }, { new: true });
  if (!category) {
    res.status(400).json({ message: "the category cannot be updated" });
  } else {
    res.status(200).send(category);
  }
});

// DELETE A CATEGORY
// DELETE: http://localhost:1999/api/v1/categories/categoryID
router.delete("/:categoryId", (req, res) => {
  const par = req.params.categoryId;
  Category.findByIdAndRemove(par)
    .then((category) => {
      return res.status(200).json({ success: true, message: `${category.name} Category has been Deleted Successfully` });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
