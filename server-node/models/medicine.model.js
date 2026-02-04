const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  discountPrice: { 
    type: Number 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Pain Relief', 'Cold & Flu', 'Vitamins', 'First Aid', 'Skincare', 'Prescription'] 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  imageUrl: { 
    type: String, 
    default: "https://placehold.co/400x300?text=Medicine" // Placeholder image
  },
  requiresPrescription: { 
    type: Boolean, 
    default: false 
  },
  rating: {
    type: Number,
    default: 4.5
  }
}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);