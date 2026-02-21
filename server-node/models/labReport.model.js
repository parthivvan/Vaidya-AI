const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor", // Optional: If a doctor requested this test
    default: null
  },
  testType: {
    type: String,
    required: true,
    enum: ["CBC", "Lipid Profile", "Thyroid", "Blood Sugar", "General Checkup"],
    default: "General Checkup"
  },
  // 🧠 THE HYBRID MAGIC
  // We store raw values here so our AI can analyze them easily later
  // e.g., { "hemoglobin": 13.5, "glucose": 140, "cholesterol": 200 }
  rawValues: {
    type: Map, 
    of: String, // Storing as string to handle units nicely if needed
    default: {}
  },
  
  // The official PDF we will generate
  pdfUrl: {
    type: String, 
    default: "" 
  },
  
  // AI Analysis (Phase 3)
  aiTags: {
    type: [String], // e.g., ["High Cholesterol", "Pre-Diabetic"]
    default: []
  },
  aiSummary: {
    type: String,
    default: "Pending Analysis..."
  },
  
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("LabReport", labReportSchema);