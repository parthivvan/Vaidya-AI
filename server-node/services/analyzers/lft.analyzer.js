const LabReference = require("../../models/labReference.model"); // 🟢 Lowercase 'l' fixed
const { evaluate } = require("../../utils/evaluator");

/**
 * Extracts Liver Function Test (LFT) metrics from raw PDF text.
 */
module.exports = async function analyzeLFT(text, patientMeta) {
    const metrics = [];

    // 1. Regex patterns for Liver markers
    const patterns = {
        ALT: /(?:ALT|SGPT|Alanine Aminotransferase)\s*[:\-]?\s*(\d+\.?\d*)/i,
        AST: /(?:AST|SGOT|Aspartate Aminotransferase)\s*[:\-]?\s*(\d+\.?\d*)/i,
        ALP: /(?:ALP|Alkaline Phosphatase)\s*[:\-]?\s*(\d+\.?\d*)/i,
        BILI: /(?:Total Bilirubin|Bilirubin Total|BILI)\s*[:\-]?\s*(\d+\.?\d*)/i
    };

    // 2. Fetch all LFT reference ranges
    const references = await LabReference.find({ panel: "LFT" });

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
    processMetric("ALT", text.match(patterns.ALT));
    processMetric("AST", text.match(patterns.AST));
    processMetric("ALP", text.match(patterns.ALP));
    processMetric("BILI", text.match(patterns.BILI));

    return { panel: "LFT", metrics };
};