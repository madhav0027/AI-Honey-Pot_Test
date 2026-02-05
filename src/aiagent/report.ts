import { runagent } from "../llm.setup";

export async function generateReport(message: any={}, conversationHistory: any[], metadata: any = {}) {
const systemPrompt = `
You are an AI agent extracting scam intelligence from a conversation with a scammer.

Task:
- Analyze the provided scammer message or conversation.
- Extract ONLY the following, if present:
  - UPI ID
  - Bank account details (account number, IFSC if available)
  - Phishing or malicious links

Rules:
- Return ONLY valid JSON.
- If a field is not found, set it to null.
- Do NOT hallucinate or guess values.
- Do NOT include explanations or extra text.

Output format:
{
  "upi_id": null,
  "bank_account": null,
  "phishing_link": null
}
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

  const result = await runagent(systemPrompt, messages);
  return result;
}
