const express = require("express");
const router = express.Router();
const LabTest = require("../models/labTest.model");

// GET ALL TESTS
router.get("/", async (req, res) => {
  try {
    const tests = await LabTest.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lab tests" });
  }
});

module.exports = router;