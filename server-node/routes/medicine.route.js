const express = require("express");
const router = express.Router();
const Medicine = require("../models/medicine.model");
const upload = require("../config/cloudinary"); // 👈 Import the config we made earlier

// POST /api/medicines/add
// upload.single('image') middleware captures the file from the frontend
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;

    // If file uploaded, use Cloudinary URL. Else use placeholder.
    const imageUrl = req.file ? req.file.path : "https://placehold.co/400"; 

    const newMedicine = new Medicine({
      name,
      category,
      price,
      stock,
      description,
      imageUrl, 
    });

    await newMedicine.save();
    res.status(201).json({ message: "Product Added!", product: newMedicine });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Error saving product" });
  }
});

// 2. GET ALL
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Error fetching medicines", error: err.message });
  }
});

// 3. GET BY ID
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: "Error fetching medicine", error: err.message });
  }
});

module.exports = router;