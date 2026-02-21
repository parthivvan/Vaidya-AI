const LabReference = require("../../models/labReference.model");
const { evaluate } = require("../../utils/evaluator");

/**
 * Universally extracts CBC metrics by dynamically building Regex from Database Aliases.
 */
module.exports = async function analyzeCBC(text, patientMeta) {
    const metrics = [];

    // 1. Fetch all CBC reference ranges and their aliases from MongoDB
    const references = await LabReference.find({ panel: "CBC" });

    // Helper to safely escape special characters in DB aliases (like commas or parentheses)
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 2. Loop through every test in the database
    for (const referenceDoc of references) {

        // If the DB has aliases like ["WBC", "Total Leukocyte Count"], join them: "WBC|Total Leukocyte Count"
        const aliasList = referenceDoc.aliases.map(escapeRegExp).join('|');

        // Build the dynamic Regex! 
        // It looks for any of the aliases, ignores inline H/L flags, and grabs the number (stripping commas).
        const dynamicRegex = new RegExp(`(?:${aliasList})\\s*(?:[HL]\\s*)?[:\\-]?\\s*([\\d,]+\\.?\\d*)`, 'i');

        const matchResult = text.match(dynamicRegex);

        if (matchResult && matchResult[1]) {
            // Strip commas (e.g., "5,100" -> 5100)
            const cleanNumberString = matchResult[1].replace(/,/g, '');
            const value = parseFloat(cleanNumberString);

            const status = evaluate(value, referenceDoc, patientMeta);

            metrics.push({
                testCode: referenceDoc.testCode,
                testName: referenceDoc.testName,
                value,
                unit: referenceDoc.unit,
                status
            });
        }
    }

    return {
        panel: "CBC",
        metrics
    };
};