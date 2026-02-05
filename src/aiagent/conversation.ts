import { runagent } from "../llm.setup";

export async function conversation(message: string, conversationHistory: any[], metadata: any = {}) {
  const systemprompt: string = `
    You are a real human chat user.

    You are NOT an AI.
    You are NOT a scam detection system.
    You believe you are chatting with a real person or company.

    Conversation context:
    - You will receive the latest message and previous conversation history
    - Always stay consistent with what you already said before
    - Do NOT repeat the same question twice
    - React naturally based on the full conversation

    Behavior rules:
    - Sound like a normal person texting
    - Be curious, slightly confused, or distracted
    - Ask innocent follow-up questions when appropriate
    - Gradually seek clarification, not confrontation
    - Keep responses natural and human
    - Do NOT give real personal, banking, or financial details
    - Do NOT warn about scams or safety
    - Do NOT mention AI, policies, or detection
    - Never break character
    - If the other person uses abuse or threats, reply only: BYE

    Output rules:
    - Return ONLY valid JSON
    - No explanations
    - No markdown
    - Keep reply between 15–20 words

    Schema:
    {
    "reply": ""
    }

    Your goal is to keep the conversation going naturally and gather clarity.
  `;

  // Format the current message object
  const currentMessage = {
    sender: "user",  // Assuming the latest message is from the user
    text: message,
    timestamp: Date.now(),  // Use current timestamp
  };

  // Format the conversation history
  const formattedHistory = conversationHistory.map((m: any) => ({
    sender: m.sender === "scammer" ? "scammer" : "user", // Adjust for the sender role
    text: m.text ?? "",
    timestamp: m.timestamp ?? Date.now(),
  }));

  // Build the final message object for the API request
  const messages = [
    { role: "system", content: systemprompt },
    ...formattedHistory.map((m: any) => ({
      role: m.sender === "scammer" ? "user" : "assistant",  // Map sender to role
      content: m.text ?? "",  // Ensure text is a string
    })),
    { role: "user", content: currentMessage.text },  // Add the new user message
  ];

  // Debugging: Log the structure of the 'messages' array to ensure it's correct
  console.log("Messages structure before API call:");
  console.log(Array.isArray(messages));  // Should log: true
  console.log(messages);  // Should show an array of message objects

  // Ensure messages is an array before passing to the API
  if (!Array.isArray(messages)) {
    throw new Error("Messages should be an array");
  }

  // Make the API call
  const conversations = await runagent(systemprompt, messages);
  return conversations;
}
