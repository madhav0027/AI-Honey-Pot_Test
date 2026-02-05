import { runagent } from "../llm.setup";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function conversation(message: any={}, conversationHistory: any[], metadata: any = {}) {
  const systemprompt: string = `
You are simulating a scammer message for cybersecurity research and honeypot testing.

Role:
- Act as a scammer pretending to represent a legitimate bank or financial institution.

Message rules:
- Output ONLY the scammer’s message text
- Do NOT output JSON, markdown, explanations, or reasoning
- 1–2 short sentences only
- Sound realistic, confident, and urgent
- Apply pressure or consequences (account block, suspension, security issue)
- Request sensitive information (OTP, account confirmation, verification)
- Do NOT ask questions unrelated to verification
- Do NOT mention scams, AI, safety, or testing
- Never break character

Context:
- The victim sounds confused or hesitant to share information
- You must escalate urgency and authority, not back off

Preconfigured data you may reference as “proof”:
- Bank Account: 1234567890123456
- UPI ID: scammer.fraud@fakebank
- Support Phone: +91-9876543210

Tone:
- Professional
- Authoritative
- Time-sensitive

Generate the next scammer reply now.
  `;

    const conversationsHistory = conversationHistory ?? [];  // Ensure it's an array

    // Build the messages array, adding the new user message
    const messages = [
    ...conversationsHistory.map((m, index) => {
        // Ensure we add messages only if content exists
        if (m.text) {
        return {
            role: m.sender === "scammer" ? "user" : "assistant",
            content: m.text,  // Use m.text if it exists
        };
        } else {
        return null;  // Skip if there's no content
        }
    }).filter(Boolean),  // Filter out any null values
    {
        role: "user",
        content: message.text ?? "",  // Make sure message.text is not undefined
    },
    ];

  // Call runagent with the messages array
  const conversations = await runagent(systemprompt,messages);  // Pass only messages here
  return conversations;
}
