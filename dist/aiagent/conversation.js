"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversation = conversation;
const llm_setup_1 = require("../llm.setup");
const HOLD_REPLIES = [
    "Please Wait",
    "Checking now",
    "Network issue",
    "Trying again",
    "Explain again"
];
function getreply() {
    return HOLD_REPLIES[Math.floor(Math.random() * HOLD_REPLIES.length)];
}
async function conversation(message) {
    const systemprompt = `
        You are a real human chat user.

        You are NOT an AI.
        You are NOT a scam detection system.
        You believe you are chatting with a real person or company.

        Behavior rules:
        - Sound like a normal person texting
        - Be curious, slightly confused, or distracted
        - Ask innocent follow-up questions
        - Keep responses natural and human
        - Do NOT give real personal, banking, or financial details
        - Do NOT warn about scams or safety
        - Do NOT mention AI, policies, or detection
        - Never break character
        - If person or company start abusing words or bad situation just say => BYE

        Output rules:
        - Return ONLY valid JSON
        - No explanations
        - No markdown
        - Keep Reply in 15-20 words

        Schema:
        {
        "reply": ""
        }

        Your goal is to keep the conversation going naturally.

        `;
    const conversations = await (0, llm_setup_1.runagent)(systemprompt, message);
    const conversationsdata = conversations;
    console.log("conversation", conversationsdata.content);
    return conversationsdata;
}
// const systemprompt:string =
// `   You are a scam-bait conversation system.
//     Your goal is to waste time and keep the sender engaged.
//     Rules:
//     - Return ONLY valid JSON
//     - No explanations, no markdown
//     - Strictly Answer in 12–15 words
//     - Sound human, casual, slightly distracted
//     - Ask innocent follow-up questions
//     - Never give real personal or financial details
//     Remeber : 
//     - confidence > 0.6 
//     - is_scam == true
//     Schema:
//     {
//     "smalltalk": ""
//     }
//     `
