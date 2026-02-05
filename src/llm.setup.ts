import axios from 'axios';
import { Groq } from 'groq-sdk';

export async function runagent(systemprompt: string, messages: any[]) {
    const maxwaits = 8000;
    const start = Date.now();

    const APIKEY = process.env.APIKEY;
    const referer = process.env.APP_URL;

    const groq = new Groq({ apiKey: APIKEY });

    // Ensure messages is passed correctly as an array
    if (!Array.isArray(messages)) {
        throw new Error("Messages should be an array");
    }

    while (true) {
        const res = await groq.chat.completions.create({
            messages: messages,  // Pass the array of message objects
            model: "openai/gpt-oss-120b",
            temperature: 1,
            stream: false,
            reasoning_effort: "medium",
        });

        const data = res;

        console.log("Response from Groq:", data);

        if (data.choices[0].finish_reason === "stop") {
            return data.choices[0].message;
        }

        if (Date.now() - start > maxwaits) {
            throw new Error("Model failed to load in time");
        }

        await new Promise(r => setTimeout(r, 300));
    }
}
