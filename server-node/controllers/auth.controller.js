const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==============================
// 1. REGISTER USER
// ==============================
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "patient", // default role
      subscription: { plan: "pulse", status: "active" },
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// 2. LOGIN USER
// ==============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🟢 Update online status
    await User.findByIdAndUpdate(user._id, {
      isOnline: true,
      lastActiveAt: new Date()
    });

    res.json({
      token,
      message: "Login Successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// 3. GOOGLE AUTH
// ==============================
const googleAuth = async (req, res) => {
  try {
    const { email, fullName, googlePhotoUrl } = req.body;

    let user = await User.findOne({ email });

    // Existing user → login
    if (user) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // 🟢 Update online status
      await User.findByIdAndUpdate(user._id, {
        isOnline: true,
        lastActiveAt: new Date()
      });

      return res.json({
        token,
        message: "Google Login Successful",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
        },
      });
    }

    // New Google user → register
    const randomPassword = Math.random().toString(36).slice(-16);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "patient",
      googlePhotoUrl,
      subscription: { plan: "pulse", status: "active" },
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🟢 Update online status
    await User.findByIdAndUpdate(user._id, {
      isOnline: true,
      lastActiveAt: new Date()
    });

    res.status(201).json({
      token,
      message: "Google Registration Successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Server Error during Google Auth" });
  }
};

// ==============================
// 4. PROMOTE TO DOCTOR (Secret)
// ==============================
const promoteToDoctor = async (req, res) => {
  try {
    const { email } = req.body;

    // Upgrade user role
    const user = await User.findOneAndUpdate(
      { email },
      { role: "doctor" },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Create doctor profile if missing
    const existingProfile = await Doctor.findOne({ userId: user._id });

    if (!existingProfile) {
      await Doctor.create({
        userId: user._id,
        specialization: "General Physician",
        experience: 5,
        consultationFee: 500,
        availability: ["09:00 AM", "10:00 AM", "11:00 AM"],
      });
    }

    res.json({
      message: `👨‍⚕️ Success! ${user.fullName} is now a Doctor.`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// 5. DEMOTE TO PATIENT (Reverse)
// ==============================
// 👇 REVERSE SPELL: Demote Doctor back to Patient AND Delete Profile
const demoteToPatient = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find and Downgrade User
    const user = await User.findOneAndUpdate(
      { email },
      { role: "patient" },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. 🗑️ DELETE THE DOCTOR PROFILE (Fixes "Ghost Doctor" issue)
    const Doctor = require("../models/doctor.model");
    await Doctor.findOneAndDelete({ userId: user._id });

    res.json({ message: `📉 Success! ${user.fullName} is now a Patient and removed from the Doctor list.`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }

};

// ==============================
// 6. LOGOUT USER
// ==============================
const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) {
      await User.findByIdAndUpdate(userId, { isOnline: false });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// ==============================
// EXPORTS (Must match auth.route.js)
// ==============================
module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  promoteToDoctor,
  demoteToPatient,
  logoutUser,
};
