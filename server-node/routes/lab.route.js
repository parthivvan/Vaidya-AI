const express = require("express");
const multer = require("multer");
const router = express.Router();
const { createReport, getMyReports, bookLabTest } = require("../controllers/lab.controller");
const { uploadAndAnalyzePDF } = require("../controllers/document.controller");
const orchestrator = require("../services/orchestrator.service");

// --- 📦 MULTER SETUP (Memory Storage for HIPAA Compliance) ---
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"), false);
        }
    }
});

// --- 🧪 LAB BOOKING ROUTES ---
router.post("/create", createReport);
router.get("/my/:userId", getMyReports);
router.post("/book", bookLabTest);

// --- 🧠 AI & ANALYSIS ROUTES ---
// The dummy text route we just tested
router.post("/test-orchestrator", async (req, res) => {
    try {
        const results = await orchestrator(req.body.rawText, req.body.patientMeta);
        res.json({ message: "Analysis Complete", data: results });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// 🟢 NEW: The Real PDF Upload Route
router.post("/analyze-pdf", upload.single("report"), uploadAndAnalyzePDF);

module.exports = router;