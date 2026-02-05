import { runagent } from "../llm.setup";

export async function classifer(message:any={},conversationHistory: any[], metadata: any = {}) {
    
    const systemprompt:string =
    `You are a scam detection system.
    
    Rules:
    - Return ONLY valid JSON
    - No explanation
    - No markdown
    - ONLY JSON 
    - NO EXPLANANTION
    - NO reasoning
    
    Schema:
    {   
        "is_scam": true/false,
        "scam_type": "",
        "confidence": 0
        }
        
        If output is not JSON, it will be rejected.
        KEEP DATA BETWEEN CURLY BRACES
        `

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
  console.log(messages)
        const result = await runagent(systemprompt,messages);
        return result
}
    