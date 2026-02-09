const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/user.model");
const Doctor = require("./models/doctor.model");

dotenv.config();

const createLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Find the existing Doctor profile
    const doctorProfile = await Doctor.findOne({ name: "Dr. Rajesh Koothrappali" });
    
    if (!doctorProfile) {
      console.log("❌ Dr. Rajesh not found in Doctors collection. Did you run seed-doctors.js?");
      process.exit(1);
    }

    console.log("👨‍⚕️ Found Doctor Profile:", doctorProfile.name);

    // 2. Create a Real User Account
    // Check if user already exists to avoid duplicates
    let user = await User.findOne({ email: "rajesh@mediflow.com" });
    
    if (user) {
      console.log("⚠️ User 'rajesh@mediflow.com' already exists. Updating link...");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("doctor123", salt);

      user = await User.create({
        fullName: "Dr. Rajesh Koothrappali",
        email: "rajesh@mediflow.com",
        password: hashedPassword,
        role: "doctor", // Important!
        phone: "9876543210"
      });
      console.log("✅ Created new User account for Dr. Rajesh");
    }

    // 3. Link the Doctor Profile to this User ID
    doctorProfile.userId = user._id;
    await doctorProfile.save();

    console.log("🔗 Successfully linked User ID to Doctor Profile.");
    console.log("===========================================");
    console.log("🎉 LOGIN DETAILS:");
    console.log("📧 Email:    rajesh@mediflow.com");
    console.log("🔑 Password: doctor123");
    console.log("===========================================");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createLogin();