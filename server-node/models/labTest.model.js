const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Blood Test", "Imaging", "Urine Test", "Health Checkup", "Covid-19"],
    required: true 
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  turnaroundTime: { type: String, default: "24 Hours" }, // e.g. "24 Hours", "3 Days"
  fastingRequired: { type: Boolean, default: false },
  imageUrl: { type: String, default: "https://placehold.co/400?text=Lab+Test" }
}, { timestamps: true });

module.exports = mongoose.model("LabTest", labTestSchema);