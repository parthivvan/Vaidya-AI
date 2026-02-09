const mongoose = require("mongoose");

const accessLogSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, default: "VIEWED_REPORT" }, // What did they do?
  details: { type: String }, // e.g., "Viewed Blood Report PDF"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AccessLog", accessLogSchema);