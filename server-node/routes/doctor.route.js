const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor.model");

// 1. GET ALL DOCTORS
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// 2. GET SINGLE DOCTOR (For booking page later)
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctor details" });
  }
});

module.exports = router;