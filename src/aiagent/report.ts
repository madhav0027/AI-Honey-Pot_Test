import { runagent } from "../llm.setup";

export async function generateReport(data:any) {
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

  const result = await runagent(systemPrompt, data);
  return result;
}
