const mongoose = require("mongoose");

const imagingReportSchema = new mongoose.Schema({
    // In a full production app, you'd make this required to link to a real patient
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: false },

    scanType: { type: String, default: "Chest X-Ray (PA View)" },

    // AI Results
    prediction: { type: String, required: true },
    confidence: { type: Number, required: true },

    // Clinical Workflow
    status: { type: String, enum: ["Pending Review", "Finalized"], default: "Finalized" },
    radiologistNotes: { type: String, default: "AI-assisted preliminary reading verified." }

}, { timestamps: true });

module.exports = mongoose.model("ImagingReport", imagingReportSchema);