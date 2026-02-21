const Doctor = require("../models/doctor.model");

const getAllDoctors = async (req, res) => {
  try {
    // Fetch all doctors and populate their User details (name, email)
    const doctors = await Doctor.find().populate("userId", "fullName email");
    
    // Debug log to confirm it's working
    console.log("✅ Doctors found:", doctors.length);
    
    res.json(doctors);
  } catch (err) {
    console.error("❌ Error fetching doctors:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAllDoctors };