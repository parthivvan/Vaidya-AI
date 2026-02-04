const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
      name: { type: String, required: true }, // Store name in case product is deleted later
      price: { type: Number, required: true }, // Store price at time of purchase
      quantity: { type: Number, default: 1 }
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"], 
    default: "Processing" 
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Card"], // Keep it simple for now
    default: "COD"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);