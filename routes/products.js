const express = require("express");
const { Category } = require("../models/Category"); // CATEGORY MODEL
const router = express.Router(); //
const { Product } = require("../models/Product"); // PRODUCT MODEL
const mongoose = require("mongoose"); // DATABASE
const fs = require("fs");
const multer = require("multer"); // FOR IMAGE UPLOAD
const path = require("path");

// = = = = = = = = = = MULTER CONFIGURATION = = = = = = = = = =

const imageFileType = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = imageFileType[file.mimetype];
    let uploadError = new Error("Invalid Image Type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    const extension = imageFileType[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

// const uploadOptions = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "public/uploads");
//     },
//     filename: function (req, file, cb) {
//       const fileName = file.originalname.replace(" ", "-");
//       cb(null, fileName + "-" + Date.now());
//     },
//   }),
// });

// = = = = = = = = = = MULTER CONFIGURATION ENDS = = = = = = = = = =

// GET ALL PRODUCTS OR
// GET: http://localhost:1999/api/v1/products
// OR
// GET ALL PRODUCTS BASED ON CATEGORY
// GET http://localhost:1999/api/v1/product?categories=${categoryID}
router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category").sort({ dateOrdered: -1 });
  if (!productList) {
    return res.status(500).json({ sucess: false });
  }
  res.send(productList);
});

// GET A SINGLE PRODUCT
// GET: http://localhost:1999/api/v1/products/${productId}
router.get(`/:id`, async (req, res) => {
  const par = req.params.id;
  const product = await Product.findById(par).populate("category");
  if (!product) {
    return res.status(500).json({ sucess: false, message: "Product with given id could not be found" });
  }
  res.send(product);
});

// CREATE NEW PRODUCT
// POST: http://localhost:1999/api/v1/products
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  // UPLOADIND IMAGE
  const file = req.file;
  if (!file) {
    return res.status(400).send("No Image is Uploaded");
  }
  const fileName = req.file.filename;
  const sourcePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  // validate category first
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }
  var product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${sourcePath}${fileName}`,
    //  images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStore: req.body.countInStore,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  console.log(`${sourcePath}${fileName}`);
  // save the product
  product = await product.save();
  if (!product) {
    return res.status(500).send("the product cannot be created");
  }
  res.send(product);
  // .then((CreatedProduct) => {
  //   return res.status(201).json(CreatedProduct);
  // })
  // .catch((err) => {
  //   return res.status(500).json({ error: err, success: false });
  // });
});

// UPDATE PRODUCT WITH MULTIPLE IMAGES
// POST: http://localhost:1999/api/v1/gallery/images/productId
router.put(`/gallery/images/:productId`, uploadOptions.array("images", 10), async (req, res) => {
  const par = req.params.productId;
  //validate ObjectID(incase we use Async & Await)
  if (!mongoose.isValidObjectId(par)) {
    res.status(404).json({ Error: "Invalid Product" });
  }

  // -----------UPDATE IMAGE FIELDS
  let imagesPath = [];
  const files = req.files;
  const sourcePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  if (files) {
    // loop inside the files to build imagePath
    files.map((file) => {
      imagesPath.push(`${sourcePath}${file.filename}`);
    });
  }
  const product = await Product.findByIdAndUpdate(par, { images: imagesPath }, { new: true });
  if (!product) {
    return res.status(400).send("product images cannot be updated");
  }
  res.send(product);
});

// UPDATE A PRODUCT
// PUT: http://localhost:1999/api/v1/products/${productId}
router.put("/:productId", uploadOptions.single("image"), async (req, res) => {
  const par = req.params.productId;
  //validate ObjectID(incase we use Async & Await)
  if (!mongoose.isValidObjectId(par)) {
    res.status(404).json({ Error: "Invalid Product" });
  }
  // ------------ FIND THE PPRODUCT
  const product = await Product.findById(par);
  if (!product) {
    return res.status(400).send("Invalid Product");
  }
  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = req.file.filename;
    const sourcePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    let oldPath1 = product.image.split("/").pop();
    console.log("ww", oldPath1);

    const oldPath = path.resolve(__dirname, "../public/uploads/", oldPath1);
    fs.unlinkSync(oldPath);
    imagePath = `${sourcePath}${fileName}`;
  } else {
    imagePath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    par,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath,
      
      // images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStore: req.body.countInStore,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  ).populate("category");
  if (!updatedProduct) {
    res.status(400).json({ message: "the product cannot be updated" });
  } else {
    res.status(200).send(updatedProduct);
  }
});

// DELETE A PRODUCT
// DELETE: http://localhost:1999/api/v1/products/${productId}
router.delete("/:productId", (req, res) => {
  const par = req.params.productId;
  Product.findByIdAndRemove(par)
    .then((product) => {
      if (product) {
        return res.status(200).json({ success: true, message: `${product.name} Product Deleted Successfully` });
      } else {
        return res.status(400).json({ success: false, message: "Product cannot be found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// COUNT PRODUCT
// GET: http://localhost:1999/api/v1/product/get/count
router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(404).json({ success: false });
  } else {
    res.send({ productCount: productCount });
  }
});

// FEATURED PRODUCT
// GET: http://localhost:1999/api/v1/product/get/featured/
router.get("/get/featured/:count?", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const featuredProduct = await Product.find({ isFeatured: true }).limit(count);
  if (!featuredProduct) {
    res.status(404).json({ success: True });
  } else {
    res.send(featuredProduct);
  }
});

module.exports = router;
