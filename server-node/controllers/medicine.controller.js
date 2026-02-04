const Medicine = require("../models/medicine.model");

// 1. Get All Medicines (with optional category filter)
const getMedicines = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const medicines = await Medicine.find(query);
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Error fetching medicines" });
  }
};

// 2. Get Single Medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Add a Dummy Medicine (For testing easier)
const seedMedicine = async (req, res) => {
  try {
    const newMed = new Medicine(req.body);
    await newMed.save();
    res.status(201).json(newMed);
  } catch (err) {
    res.status(400).json({ message: "Error creating medicine", error: err.message });
  }
};

module.exports = { getMedicines, getMedicineById, seedMedicine };