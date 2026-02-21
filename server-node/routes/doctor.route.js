const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor.model");
const upload = require("../config/cloudinary"); // Upload middleware

// 🟢 GET ALL DOCTORS (Public Route)
router.get("/", async (req, res) => {
  try {
    // Fetch all doctors but exclude their passwords
    const doctors = await Doctor.find().select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
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

// 🟢 ROUTE: Upload/Update Doctor Profile Picture
router.put("/:id/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // req.file.path contains the secure Cloudinary URL
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      { new: true }
    );

    res.json({ message: "Profile picture updated successfully!", doctor: updatedDoctor });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});


module.exports = router;