const express = require("express");
const router = express.Router();
const { createReport, getMyReports } = require("../controllers/lab.controller");

// POST /api/labs/create
router.post("/create", createReport);

// GET /api/labs/my/:userId
router.get("/my/:userId", getMyReports);

module.exports = router;