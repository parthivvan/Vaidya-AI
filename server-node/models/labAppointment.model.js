const mongoose = require("mongoose");

const labAppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    labTestId: { type: mongoose.Schema.Types.ObjectId, ref: "LabTest", required: true },
    // Optional: labAdminId if referring to a specific technician
    labAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Format: "YYYY-MM-DD" or similar ISO String
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },

    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending"
    },
    reportStatus: {
        type: String,
        enum: ["pending", "generated"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("LabAppointment", labAppointmentSchema);
