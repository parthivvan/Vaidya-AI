const LabReport = require("../models/labReport.model");
const User = require("../models/user.model");

// 1. Create a New Report (Admin enters data)
const createReport = async (req, res) => {
  try {
    const { patientId, testType, rawValues } = req.body;

    // A. Create the DB Entry
    const newReport = new LabReport({
      patientId,
      testType,
      rawValues,
      status: "completed", // For now, we assume it's done instantly
      pdfUrl: "https://via.placeholder.com/150" // Placeholder until we build PDFKit
    });

    await newReport.save();

    res.status(201).json({ message: "Report Created", report: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error creating report" });
  }
};

// 2. Get My Reports (For Patient Dashboard)
const getMyReports = async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await LabReport.find({ patientId: userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error fetching reports" });
  }
};

module.exports = { createReport, getMyReports };