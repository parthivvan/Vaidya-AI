const express = require("express");
const router = express.Router();
const Prescription = require("../models/prescription.model");
const Appointment = require("../models/appointment.model");

// 1. CREATE a new prescription (Doctor action)
router.post("/", async (req, res) => {
    try {
        const newPrescription = new Prescription(req.body);
        const savedPrescription = await newPrescription.save();

        // Automatically update the appointment status to "completed" since a prescription was issued!
        await Appointment.findByIdAndUpdate(req.body.appointmentId, { status: "completed" });

        res.status(201).json(savedPrescription);
    } catch (error) {
        console.error("Prescription Error:", error);
        res.status(500).json({ message: "Failed to create prescription" });
    }
});

// 2. GET a prescription by Appointment ID (To view the PDF later)
router.get("/appointment/:appointmentId", async (req, res) => {
    try {
        const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
            .populate("doctorId", "name specialization signature")
            .populate("patientId", "fullName email")
            .populate("medicines.medicineId"); // Pulls the actual pharmacy product details!

        if (!prescription) return res.status(404).json({ message: "Prescription not found" });

        res.json(prescription);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. 🟢 THE MAGIC CART MATCHER
router.post("/appointment/:appointmentId/magic-cart", async (req, res) => {
    try {
        const Medicine = require("../models/medicine.model"); // Dynamic require to avoid circular dependency issues if any

        // 1. Find the prescription
        const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId });
        if (!prescription) return res.status(404).json({ message: "Prescription not found" });

        // 2. Extract the drug names the doctor typed
        // Note: The schema now has 'name' which is what the doctor typed.
        const rxNames = prescription.medicines.map(m => m.name);

        if (rxNames.length === 0) {
            return res.status(400).json({ message: "No medicines found on this prescription." });
        }

        // 3. Fuzzy Search the Pharmacy Database!
        // We use $regex and "i" (case-insensitive) so "para" matches "Paracetamol 500mg"

        const matchedProducts = [];
        const missingProducts = [];

        for (let name of rxNames) {
            // Search for any pharmacy product containing this name
            // Using regex to find partial matches (e.g., "Amox" finds "Amoxicillin")
            const match = await Medicine.findOne({ name: { $regex: name, $options: "i" } });

            if (match) {
                matchedProducts.push(match);
            } else {
                missingProducts.push(name);
            }
        }

        res.json({
            message: "Magic scan complete",
            foundCount: matchedProducts.length,
            totalCount: rxNames.length,
            matchedProducts,
            missingProducts
        });

    } catch (error) {
        console.error("Magic Cart Error:", error);
        res.status(500).json({ message: "Server Error during Magic Match" });
    }
});

// 3. GET ALL prescriptions (For Super Admin Dashboard)
router.get("/all", async (req, res) => {
    try {
        const prescriptions = await Prescription.find()
            .populate("doctorId", "name specialization") // Get doctor details
            .populate("patientId", "fullName email")     // Get patient details
            .sort({ createdAt: -1 });                    // Newest prescriptions first

        res.json(prescriptions);
    } catch (error) {
        console.error("Admin Fetch Prescriptions Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;