const express = require("express");
const router = express.Router();
const { Order } = require("../models/Order");
const { OrderItem } = require("../models/OrderItem");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// GET ALL ORDERS
// GET: http://localhost:1999/api/v1/orders
router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name phone email")
    .populate({ path: "orderItems", populate: { path: "product", select: "name price ", populate: { path: "category", select: "name" } } })
    .sort({ dateOrdered: -1 });
  if (!orderList) {
    res.status(500).json({ Succes: false });
  } else {
    res.send(orderList);
  }
});

// GET A PARTICULAR ORDER BY ID
// GET: http://localhost:1999/api/v1/orders/orderID
router.get("/:orderId", async (req, res) => {
  const par = req.params.orderId;
  const order = await Order.findById(par)
    .populate("user", "name email phone")
    .populate({ path: "orderItems", populate: { path: "product", select: "name price", populate: { path: "category", select: "name" } } });
  if (!order) {
    res.status(500).json({ message: "the order with cannot be found" });
  } else {
    res.status(200).send(order);
  }
});

// MAKE AN ORDER
// POST: http://localhost:1999/api/v1/orders
router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  // RESOLVE OUR ORDERITEMSID TO GENERATE ID FOR THE ORDER
  const orderItemsIdResolved = await orderItemsIds;
  //console.log(orderItemsIds);
  // console.log(orderItemsIdResolved);
  // --------------------------------------

  // GET TOTAL PRICE
  const totalPrices = await Promise.all(
    orderItemsIdResolved.map(async (orderItemsId) => {
      const orderItem = await OrderItem.findById(orderItemsId).populate("product", "price");
      // console.log(orderItem);;
      const totalPrice = orderItem.quantity * orderItem.product.price;
      return totalPrice;
    })
  );

  // console.log(totalPrices);
  const totalPrice = totalPrices.reduce((total, item) => total + item, 0);

  let order = new Order({
    // orderitems: req.body.orderItems,
    //orderitems: orderItemsIds,
    orderItems: orderItemsIdResolved,
    shippingAddress: req.body.shippingAddress,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zipCode: req.body.zipCode,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  // check

  if (!order) {
    return res.status(404).send("The order cannot be created");
  } else res.send(order);
});

// UPDATE AN ORDER
// PUT: http://localhost:1999/api/v1/order/orderID
router.put("/:orderId", async (req, res) => {
  const par = req.params.orderId;
  const order = await Order.findByIdAndUpdate(par, { status: req.body.status }, { new: true });
  if (!order) {
    res.status(400).json({ message: "the order cannot be updated" });
  } else {
    res.status(200).send(order);
  }
});

// DELETE A ORDER & ORDERITEMS
// DELETE: http://localhost:1999/api/v1/categories/categoryID
router.delete("/:orderId", (req, res) => {
  const par = req.params.orderId;
  Order.findByIdAndRemove(par)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res.status(200).json({ success: true, message: `Order has been Deleted Successfully` });
      } else {
        return res.status(400).json({ success: false, message: `Order could no be found` });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// GET TOTALSALES
router.get("/get/totalsales", async (req, res) => {
  const totalsales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalsales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  if (!totalsales) {
    return res.status(500).send("The TotalSales cannot be calculated ");
  }
  return res.send({ totalsales: totalsales[0].totalsales });
  // return res.send({ totalsales: totalsales.pop().totalsales });
});

// COUNT ORDERS
// GET: http://localhost:1999/api/v1/orders/get/count
router.get("/get/count", async (req, res) => {
  const userOrderCount = await Order.countDocuments();
  if (!userOrderCount) {
    res.status(404).json({ success: false });
  } else {
    res.send({ userOrderCount: userOrderCount });
  }
});

// GET USER'S ORDERS
router.get("/get/user-orders/:UserId", async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.UserId })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: { path: "category" },
      },
    })
    .sort({ dateOrderd: -1 });
  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(userOrderList);
});

module.exports = router;
