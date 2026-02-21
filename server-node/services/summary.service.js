/**
 * Deterministically generates a clinical summary based on extracted lab metrics.
 * @param {Array} panels - The array of panels returned by the orchestrator.
 */
function generateSummary(panels) {
    const abnormalities = [];
    let riskScore = 0;
    let criticalCount = 0;

    // 1. Scan all panels for abnormal metrics
    panels.forEach(panel => {
        panel.metrics.forEach(metric => {
            if (metric.status !== "Normal" && metric.status !== "Reference Missing") {
                // Save the abnormality details
                abnormalities.push({
                    testName: metric.testName,
                    value: metric.value,
                    unit: metric.unit,
                    status: metric.status
                });

                // Calculate Risk Weight
                if (metric.status.includes("Critical")) {
                    riskScore += 3;
                    criticalCount++;
                } else {
                    riskScore += 1;
                }
            }
        });
    });

    // 2. Determine Overall Risk Level (Max score of 10 for UI purposes)
    const normalizedScore = Math.min(riskScore, 10);
    let riskLevel = "Low";
    if (normalizedScore >= 4) riskLevel = "High";
    else if (normalizedScore > 0) riskLevel = "Moderate";

    // 3. Generate the Deterministic Clinical Paragraph
    let paragraph = "All analyzed metrics fall within normal biological reference ranges. No immediate clinical action is required based on these specific parameters.";

    if (abnormalities.length > 0) {
        // Extract just the names of the abnormal tests (e.g., "Hemoglobin, Serum Creatinine")
        const abnormalNames = abnormalities.map(a => a.testName).join(', ');

        paragraph = `Patient exhibits ${abnormalities.length} abnormal value(s). `;

        if (criticalCount > 0) {
            paragraph += `URGENT: ${criticalCount} metric(s) are in the critical range requiring immediate clinical correlation. `;
        }

        paragraph += `Specifically, abnormalities were detected in: ${abnormalNames}. Clinical evaluation and continuous monitoring recommended.`;
    }

    // 4. Return the bundled summary
    return {
        abnormalities,
        riskScore: normalizedScore,
        riskLevel,
        paragraph
    };
}

module.exports = { generateSummary };