const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

// UPDATE LOCATION ROUTE
router.put("/:id/location", async (req, res) => {
  try {
    const { location } = req.body;
    await User.findByIdAndUpdate(req.params.id, { location });
    res.json({ message: "Location updated" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET ALL USERS (For Super Admin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Don't show passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;