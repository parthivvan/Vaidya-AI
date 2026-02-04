const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders } = require("../controllers/order.controller");

router.post("/create", createOrder);
router.get("/user/:userId", getMyOrders);

module.exports = router;