const mongoose = require("mongoose");

const ageGroupSchema = new mongoose.Schema({
    minAge: { type: Number, required: true },
    maxAge: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "All"], default: "All" },
    minNormal: { type: Number, required: true },
    maxNormal: { type: Number, required: true },
}, { _id: false });

const labReferenceSchema = new mongoose.Schema({
    testCode: { type: String, required: true, unique: true, index: true }, // e.g., "HB", "WBC"
    testName: { type: String, required: true }, // e.g., "Hemoglobin"

    // 🟢 NEW: ALIAS ARRAY FOR DYNAMIC PARSING
    aliases: [{ type: String, required: true }],

    panel: { type: String, required: true }, // e.g., "CBC", "LFT"
    unit: { type: String, required: true }, // e.g., "g/dL", "mg/dL"

    // Array to support different ranges for men, women, children, etc.
    ageGroups: [ageGroupSchema],

    criticalLow: { type: Number },
    criticalHigh: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("LabReference", labReferenceSchema);