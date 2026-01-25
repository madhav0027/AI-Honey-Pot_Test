import { runagent } from "../llm.setup";

export async function generateReport(data:any) {
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

  const result = await runagent(systemPrompt, data);
  return result;
}
