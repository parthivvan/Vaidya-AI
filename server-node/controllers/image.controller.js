const ImagingReport = require("../models/imagingReport.model"); // 🟢 IMPORT MODEL

// Native fetch and FormData are available in Node.js 18+
const analyzeImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No image uploaded." });
        }

        console.log(`🩻 Forwarding X-Ray to Python AI: ${file.originalname}`);

        // 1. Package the image buffer to send to Python
        const formData = new FormData();
        const blob = new Blob([file.buffer], { type: file.mimetype });
        formData.append("file", blob, file.originalname);

        // 2. Call your Python Microservice (Port 8000)
        const pythonResponse = await fetch("http://localhost:8000/api/vision/analyze", {
            method: "POST",
            body: formData
        });

        if (!pythonResponse.ok) {
            throw new Error(`Python AI Service Error: ${pythonResponse.statusText}`);
        }

        // 3. Parse the JSON from Python
        const aiResult = await pythonResponse.json();

        // 4. Send the final structured result back to the React Frontend
        res.status(200).json({
            message: "X-Ray Analyzed Successfully",
            data: aiResult
        });

    } catch (error) {
        console.error("Vision AI Bridge Error:", error);
        res.status(500).json({ message: "Failed to process X-Ray image via AI service." });
    }
};

// 🟢 NEW: Save the finalized AI report to MongoDB
const saveReport = async (req, res) => {
    try {
        const { prediction, confidence, notes } = req.body;

        const newReport = new ImagingReport({
            patientId: req.body.patientId || null, // 🟢 FIX: Link to patient if provided
            prediction,
            confidence,
            radiologistNotes: notes || "AI findings verified by attending radiologist."
        });

        await newReport.save();

        console.log(`💾 X-Ray Report Saved: ${newReport._id}`);

        res.status(201).json({
            message: "Report finalized and securely saved to database.",
            report: newReport
        });

    } catch (error) {
        console.error("Database Save Error:", error);
        res.status(500).json({ message: "Failed to save clinical report." });
    }
};

// 🟢 NEW: Fetch all finalized reports for a specific patient
const getPatientReports = async (req, res) => {
    try {
        const { patientId } = req.params;
        const reports = await ImagingReport.find({ patientId }).sort({ createdAt: -1 }); // Newest first

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching patient reports:", error);
        res.status(500).json({ message: "Failed to fetch medical records." });
    }
};

module.exports = { analyzeImage, saveReport, getPatientReports }; // 🟢 EXPORT IT