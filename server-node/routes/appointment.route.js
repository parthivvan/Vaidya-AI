const express = require("express");
const router = express.Router();
const { 
  bookAppointment, 
  getMyAppointments, 
  getDoctorAppointments,
  getBookedSlots,
  cancelAppointment
} = require("../controllers/appointment.controller");

// 1. Book Appointment
router.post("/book", bookAppointment);

// 2. Patient History
router.get("/patient/:userId", getMyAppointments);

// 3. Doctor Dashboard
router.get("/doctor/:doctorId", getDoctorAppointments);

// 4. 🚨 THIS IS THE MISSING LINK! 🚨
router.get("/booked-slots", getBookedSlots);

// 5. Cancel Appointment
router.put("/cancel/:appointmentId", cancelAppointment);

module.exports = router;