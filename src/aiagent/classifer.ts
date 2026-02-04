import { runagent } from "../llm.setup";

export async function classifer(message:any) {
    
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
        const result = await runagent(systemprompt,message);
        return result
}
    