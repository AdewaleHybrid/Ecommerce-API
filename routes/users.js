const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GET ALL USER
// GET: http://localhost:1999/api/v1/users
router.get("/", async (req, res) => {
  const userList = await User.find().select("-password -__v");
  if (!userList) {
    res.status(500).json({ Succes: false });
  } else {
    res.send(userList);
  }
});

// GET ONE USER
// GET: http://localhost:1999/api/v1/users/${userID}
router.get("/:userId", async (req, res) => {
  const par = req.params.userId;
  const user = await User.findById(par).select("-password -__v");
  if (!user) {
    res.status(500).json({ message: "The user with the ID cannot be found" });
  } else {
    res.status(200).send(user);
  }
});

// REGISTER NEW ADMIN
// POST: http://localhost:1999/api/v1/users
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zipCode: req.body.zipCode,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  // check
  if (!user) {
    return res.status(404).send("The Admin cannot be created");
  }
  res.send(user);
});

// REGISTER NEW USER
// POST: http://localhost:1999/api/v1/users/register
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zipCode: req.body.zipCode,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  // check
  if (!user) {
    return res.status(404).send("The User cannot be created");
  }
  res.send(user);
});

// UPDATE A USER
// PUT: http://localhost:1999/api/v1/users/${userID}
router.put("/:userId", async (req, res) => {
  const par = req.params.userId;
  const user = await User.findByIdAndUpdate(
    par,
    {
      name: req.body.name,
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      zipCode: req.body.zipCode,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );
  if (!user) {
    res.status(400).json({ message: "the user cannot be updated" });
  } else {
    res.status(200).send(user);
  }
});

// DELETE A USER
// DELETE: http://localhost:1999/api/v1/users/${userID}
router.delete("/:userId", (req, res) => {
  const par = req.params.userId;
  User.findByIdAndRemove(par)
    .then((user) => {
      return res.status(200).json({ success: true, message: `User with the name ${user.name} Deleted Successful` });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// USER LOGIN
router.post("/login", async (req, res) => {
  // USING EMAIL AND PASSWORD
  const user = await User.findOne({ email: req.body.email });
  // CHECK EMAIL
  if (!user) {
    return res.status(400).send("Email not found");
  }
  // LOGIN USER
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const secret = process.env.secret;
    const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, secret, { expiresIn: "1d" });
    return res.status(200).send({ user: user.email, isAdmin: user.isAdmin, token: token });
  } else {
    return res.status(400).send("Wrong Email Or Password");
  }
});

// COUNT USERS
router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    res.status(404).json({ success: True });
  } else {
    res.send({ userCount: userCount });
  }
});

module.exports = router;
