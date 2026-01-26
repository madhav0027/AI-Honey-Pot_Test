"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifer = classifer;
const llm_setup_1 = require("../llm.setup");
async function classifer(message) {
    const systemprompt = `You are a scam detection system.
    
    Rules:
    - Return ONLY valid JSON
    - No explanation
    - No markdown
    
    Schema:
    {   
        "is_scam": true/false,
        "scam_type": "",
        "confidence": 0
        }
        
        If output is not JSON, it will be rejected.
        KEEP DATA BETWEEN CURLY BRACES
        `;
    const result = await (0, llm_setup_1.runagent)(systemprompt, JSON.stringify(message));
    return result.content;
}
