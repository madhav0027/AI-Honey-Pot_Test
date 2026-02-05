import {Groq} from 'groq-sdk'

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function runagent(systemPrompt:string , userprompt:any={}) {
  const maxwaits = 8000;
  const start = Date.now();
  
  const APIKEY = process.env.APIKEY;
  const referer = process.env.APP_URL;

  const groq = new Groq({ apiKey: APIKEY });


  while (true) {
    const res = await groq.chat.completions.create({ 
        "messages": [ { "role":"system", "content":systemPrompt }, 
            { "role": "user", "content":userprompt[0]?.content } ], 
            "model": "openai/gpt-oss-120b", 
            "temperature": 1, "stream": false,
         "reasoning_effort": "medium", });
    const data = res;
    console.log(data.choices[0].message.content);
    if (data.choices[0].finish_reason === "stop") {
      return data.choices[0].message;
    }

    if (Date.now() - start > maxwaits) {
      throw new Error("Model failed to load in time");
    }

    await new Promise(r => setTimeout(r, 300));
  }
}
