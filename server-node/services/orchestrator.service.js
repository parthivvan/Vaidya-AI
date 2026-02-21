const analyzeCBC = require("./analyzers/cbc.analyzer");
const analyzeRFT = require("./analyzers/rft.analyzer");
const analyzeLFT = require("./analyzers/lft.analyzer");     // 🟢 NEW
const analyzeLipid = require("./analyzers/lipid.analyzer"); // 🟢 NEW

module.exports = async function orchestrator(text, patientMeta) {
    const analyzerPromises = [];

    // CBC Keywords
    if (text.match(/Hemoglobin|WBC|RBC|Complete Blood Count|Leukocyte/i)) {
        console.log("🧬 Orchestrator: CBC Panel Detected");
        analyzerPromises.push(analyzeCBC(text, patientMeta));
    }

    // RFT Keywords
    if (text.match(/Creatinine|Urea|BUN|Uric Acid|Renal|Kidney/i)) {
        console.log("🧪 Orchestrator: RFT Panel Detected");
        analyzerPromises.push(analyzeRFT(text, patientMeta));
    }

    // 🟢 LFT (Liver) Keywords
    if (text.match(/ALT|AST|Bilirubin|Alkaline Phosphatase|Liver|LFT|SGPT|SGOT/i)) {
        console.log("🟡 Orchestrator: LFT Panel Detected");
        analyzerPromises.push(analyzeLFT(text, patientMeta));
    }

    // 🟢 Lipid Profile (Heart) Keywords
    if (text.match(/Cholesterol|HDL|LDL|Triglycerides|Lipid/i)) {
        console.log("🟠 Orchestrator: Lipid Panel Detected");
        analyzerPromises.push(analyzeLipid(text, patientMeta));
    }

    // 2. Execute all detected analyzers concurrently
    const rawResults = await Promise.all(analyzerPromises);

    // 3. Filter out any empty panels
    const validResults = rawResults.filter(panel => panel.metrics && panel.metrics.length > 0);

    // 4. Return the unified payload
    return validResults;
};