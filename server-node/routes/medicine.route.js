const express = require("express");
const router = express.Router();
const { getMedicines, getMedicineById, seedMedicine } = require("../controllers/medicine.controller");
const upload = require('../config/cloudinary'); // Import the config

// GET /api/medicines
router.get("/", getMedicines);

// GET /api/medicines/:id
router.get("/:id", getMedicineById);

// POST /api/medicines/upload
router.post('/upload', upload.single('image'), (req, res) => {
  // Cloudinary automatically handles the upload before we get here
  // req.file.path contains the new URL
  res.json({ url: req.file.path });
});

// POST /api/medicines/seed (Only for testing/admin)
router.post("/seed", seedMedicine);

module.exports = router;