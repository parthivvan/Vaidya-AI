const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    unique: true 
  },
  // --- UI FIELDS (Added) ---
  name: { type: String, required: true }, // Easier to fetch than joining User table
  image: { type: String, default: "https://placehold.co/400" }, 
  hospital: { type: String, default: "MediFlow General Hospital" },
  rating: { type: Number, default: 4.5 },
  
  // --- YOUR EXISTING FIELDS ---
  specialization: {
    type: String,
    required: true, 
  },
  experience: {
    type: Number, 
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
  availableSlots: {
    type: [String], 
    default: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "05:00 PM"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);