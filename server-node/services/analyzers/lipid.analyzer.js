const LabReference = require("../../models/labReference.model"); // 🟢 Lowercase 'l' fixed
const { evaluate } = require("../../utils/evaluator");

/**
 * Extracts Lipid Profile (Cholesterol) metrics from raw PDF text.
 */
module.exports = async function analyzeLipid(text, patientMeta) {
    const metrics = [];

    // 1. Regex patterns for Heart/Cholesterol markers
    const patterns = {
        CHOL: /(?:Total Cholesterol|Cholesterol)\s*[:\-]?\s*(\d+\.?\d*)/i,
        HDL: /(?:HDL|High Density Lipoprotein)\s*[:\-]?\s*(\d+\.?\d*)/i,
        LDL: /(?:LDL|Low Density Lipoprotein)\s*[:\-]?\s*(\d+\.?\d*)/i,
        TRIG: /(?:Triglycerides|TRIG)\s*[:\-]?\s*(\d+\.?\d*)/i
    };

    // 2. Fetch all LIPID reference ranges
    const references = await LabReference.find({ panel: "LIPID" });

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
    processMetric("CHOL", text.match(patterns.CHOL));
    processMetric("HDL", text.match(patterns.HDL));
    processMetric("LDL", text.match(patterns.LDL));
    processMetric("TRIG", text.match(patterns.TRIG));

    return { panel: "Lipid Profile", metrics };
};