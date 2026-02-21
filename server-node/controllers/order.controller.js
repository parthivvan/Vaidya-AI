const Order = require("../models/order.model");
const Medicine = require("../models/medicine.model");

// 1. Place a New Order
const createOrder = async (req, res) => {
  try {
    const { patientId, items, totalAmount } = req.body;

    // 🟢 FIX: Validate input
    if (!patientId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // (Optional) Verify stock here before confirming...

    const newOrder = new Order({
      patientId,
      items,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
};

// 2. Get Orders for a Specific Patient
const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ patientId: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

module.exports = { createOrder, getMyOrders };