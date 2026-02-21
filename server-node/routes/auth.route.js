const express = require("express");
const router = express.Router();

// 👇 IMPORT ALL FUNCTIONS (Make sure demoteToPatient is in this list!)
const { 
  registerUser, 
  loginUser, 
  googleAuth, 
  promoteToDoctor,
  demoteToPatient // 👈 You likely missed adding this here
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// Secret Backdoors
router.post("/promote", promoteToDoctor);
router.post("/demote", demoteToPatient); // 👈 This works now because it's imported above

module.exports = router;