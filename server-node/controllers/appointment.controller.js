const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");

// 1. BOOK APPOINTMENT
const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, timeSlot } = req.body;

    // Check if slot is taken (String Match)
    const existing = await Appointment.findOne({
      doctorId,
      date: date, 
      timeSlot,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked!" });
    }

    const newAppt = new Appointment({
      patientId,
      doctorId,
      date, // Saves as "2026-02-02"
      timeSlot,
      meetingLink: `https://meet.google.com/${Math.random().toString(36).substring(7)}`
    });

    await newAppt.save();
    res.status(201).json({ message: "Success", appointment: newAppt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking Error" });
  }
};

// 2. GET BOOKED SLOTS
const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query; 

    // console.log(`🔎 Checking: ${doctorId} on ${date}`);

    const appointments = await Appointment.find({
      doctorId,
      date: date, // Exact String Match
      status: { $ne: "cancelled" }
    });

    const slots = appointments.map(app => app.timeSlot);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching slots" });
  }
};

// 3. GET PATIENT HISTORY
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.userId })
      .populate({ path: "doctorId", populate: { path: "userId", select: "fullName" }})
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching history" });
  }
};

// 4. DOCTOR & 5. ALL DOCTORS (Keep existing logic)
const getDoctorAppointments = async (req, res) => {
    try {
        const doc = await Doctor.findOne({ userId: req.params.doctorId });
        if(!doc) return res.status(404).json({message: "Doc not found"});
        const appts = await Appointment.find({ doctorId: doc._id }).populate("patientId", "fullName email");
        res.json(appts);
    } catch(e) { res.status(500).json({message: "Error"}); }
};

const getAllDoctors = async (req, res) => {
    try {
        const docs = await Doctor.find().populate("userId", "fullName email");
        res.json(docs);
    } catch(e) { res.status(500).json({message: "Error"}); }
};

// CANCEL APPOINTMENT
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error cancelling appointment" });
  }
};

module.exports = {
  bookAppointment,
  getBookedSlots,
  getMyAppointments,
  getDoctorAppointments,
  getAllDoctors,
  cancelAppointment
};