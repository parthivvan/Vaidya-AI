const express = require("express");
const router = express.Router();
const multer = require('multer');

// 🟢 2. Configure Multer to hold the file in RAM temporarily
const upload = multer({ storage: multer.memoryStorage() });

const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getBookedSlots,
  cancelAppointment
} = require("../controllers/appointment.controller");

// 🟢 3. Inject upload.single('labReport') BEFORE bookAppointment!
// This tells Multer: "Grab the file named 'labReport', put it in req.file, 
// and put the rest of the text fields into req.body!"
router.post("/book", upload.single("labReport"), bookAppointment);

// 2. Patient History
router.get("/patient/:userId", getMyAppointments);

// 3. Doctor Dashboard
router.get("/doctor/:doctorId", getDoctorAppointments);

// 4. 🚨 THIS IS THE MISSING LINK! 🚨
router.get("/booked-slots", getBookedSlots);

// 5. Cancel Appointment
router.put("/cancel/:appointmentId", cancelAppointment);

module.exports = router;