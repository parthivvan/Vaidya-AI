const LabReference = require("../../models/labReference.model");
const { evaluate } = require("../../utils/evaluator");

/**
 * Extracts Renal Function Test (RFT) / Kidney metrics from raw PDF text.
 */
module.exports = async function analyzeRFT(text, patientMeta) {
    const metrics = [];

    // 1. Define Regex patterns for Kidney markers
    const patterns = {
        CREAT: /(?:Creatinine|Serum Creatinine|S\. Creatinine)\s*[:\-]?\s*(\d+\.?\d*)/i,
        UREA: /(?:Urea|Blood Urea|Serum Urea)\s*[:\-]?\s*(\d+\.?\d*)/i,
        BUN: /(?:BUN|Blood Urea Nitrogen)\s*[:\-]?\s*(\d+\.?\d*)/i,
        URIC: /(?:Uric Acid|Serum Uric Acid)\s*[:\-]?\s*(\d+\.?\d*)/i
    };

    // 2. Fetch all RFT reference ranges from the database at once
    const references = await LabReference.find({ panel: "RFT" });

    // Helper function to process each metric safely
    const processMetric = (testCode, matchResult) => {
        if (matchResult && matchResult[1]) {
            const value = parseFloat(matchResult[1]);
            const referenceDoc = references.find(r => r.testCode === testCode);

            const status = referenceDoc ? evaluate(value, referenceDoc, patientMeta) : "Reference Missing";

            metrics.push({
                testCode,
                testName: referenceDoc ? referenceDoc.testName : testCode,
                value,
                unit: referenceDoc ? referenceDoc.unit : "Unknown",
                status
            });
        }
    };

    // 3. Execute extractions
    processMetric("CREAT", text.match(patterns.CREAT));
    processMetric("UREA", text.match(patterns.UREA));
    processMetric("BUN", text.match(patterns.BUN));
    processMetric("URIC", text.match(patterns.URIC));

    // 4. Return the structured panel
    return {
        panel: "RFT",
        metrics
    };
};