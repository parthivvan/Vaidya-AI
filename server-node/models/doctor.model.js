const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links to the User collection
    required: true,
    unique: true // One user can only be one doctor profile
  },
  specialization: {
    type: String,
    required: true, // e.g., "Cardiologist", "General Physician"
  },
  experience: {
    type: Number, // Years of experience
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  bio: {
    type: String,
    default: "Committed to patient care."
  },
  // Simple availability array for now (e.g., ["10:00 AM", "11:00 AM"])
  availableSlots: {
    type: [String], 
    default: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);