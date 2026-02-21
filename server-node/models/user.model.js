const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["patient", "doctor", "superadmin"],
    default: "patient",
  },
  phone: {
    type: String,
  },
  location: {
    type: String,
    default: "Unknown",
  },
  // 🟢 NEW: Track online status
  isOnline: { type: Boolean, default: false },

  // Optional: Track last seen
  lastActiveAt: { type: Date, default: Date.now },
  // 👇 NEW: Subscription Logic
  subscription: {
    plan: {
      type: String,
      enum: ["pulse", "vitals_plus", "neuro_ai"], // matches our pricing names
      default: "pulse" // Everyone starts on Free
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active"
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null // Null means "Forever" (for free plan)
    }
  },
  googlePhotoUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);