const { PDFParse } = require("pdf-parse"); // 🟢 Import the new specific class
const orchestrator = require("../services/orchestrator.service");
const { generateSummary } = require("../services/summary.service"); // 🟢 IMPORT SUMMARY ENGINE

const uploadAndAnalyzePDF = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No PDF uploaded." });

        console.log(`📁 File Received: ${file.originalname} (${file.size} bytes)`);

        // 1. Initialize the new Version 2 Parser
        const parser = new PDFParse({ data: file.buffer });
        const result = await parser.getText();
        const rawText = result.text;

        console.log("📄 Extracted Text Preview:", rawText.substring(0, 100));

        const patientMeta = { age: 30, gender: "Male" };

        // 2. Get raw metrics from Orchestrator
        const analysisResults = await orchestrator(rawText, patientMeta);

        // 3. Generate the Summary based on those metrics
        const summary = generateSummary(analysisResults);

        // 🟢 FIX: Save the lab report to the database
        const LabReport = require("../models/labReport.model");
        const newReport = new LabReport({
            patientId: req.body.patientId || null, // Optional, if provided
            testType: "General Checkup", // Or infer from analysisResults
            rawValues: {}, // Could map analysisResults here
            aiSummary: summary.paragraph,
            status: "completed"
        });
        // Only save if patientId is provided
        if (req.body.patientId) {
            await newReport.save();
        }

        // 4. Bundle them together in a new payload structure
        res.status(200).json({
            message: "PDF Analyzed Successfully",
            data: {
                panels: analysisResults,
                summary: summary,
                reportId: req.body.patientId ? newReport._id : null
            }
        });

    } catch (error) {
        console.error("PDF Parsing Error:", error);
        res.status(500).json({ message: "Failed to process PDF document.", error: error.message });
    }
};

module.exports = { uploadAndAnalyzePDF };