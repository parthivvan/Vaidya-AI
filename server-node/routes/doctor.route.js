const express = require("express");
const router = express.Router();
const { getAllDoctors } = require("../controllers/doctor.controller");

// GET /api/doctors
router.get("/", getAllDoctors);

module.exports = router;