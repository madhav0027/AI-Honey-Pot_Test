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

         const messages = [
    ...(conversationHistory ?? []).map((m) => {
      return {
        role: (m.sender === "scammer" ? "user" : "assistant") as "user" | "assistant", 
        content: m.text ?? "", 
      };
    }),
    {
      role: "user",
      content: message.text, 
    },
  ];
  console.log(messages)
        const result = await runagent(systemprompt,messages);
        return result
}
    