const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/user.model");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@mediflow.com";
    const password = "admin123";

    // Check if exists
    let user = await User.findOne({ email });

    if (user) {
      console.log("⚠️ Admin already exists.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        fullName: "Super Administrator",
        email: email,
        password: hashedPassword,
        role: "superadmin", // 👈 The Key Permission
        phone: "0000000000"
      });
      console.log("✅ SUPER ADMIN CREATED!");
    }

    console.log("===========================================");
    console.log("📧 Email:    " + email);
    console.log("🔑 Password: " + password);
    console.log("===========================================");
    console.log("👉 Login at: http://localhost:5173/login");
    
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();