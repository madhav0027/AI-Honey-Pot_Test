"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
const llm_setup_1 = require("../llm.setup");
async function generateReport(data) {
    const systemPrompt = `
You are a cybercrime report generator.

Return ONLY valid JSON:
{
  "scam_type": "",
  "confidence": 0,
  "extracted_data": {},
  "summary": "",
  "conversation": []
}
`;
    const result = await (0, llm_setup_1.runagent)(systemPrompt, data);
    return result;
}
