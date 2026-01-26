"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runagent = runagent;
const openai_1 = __importDefault(require("openai"));
async function runagent(systemprompt, userprompt) {
    const maxwaits = 8000;
    const start = Date.now();
    const APIKEY = process.env.APIKEY;
    const openai = new openai_1.default({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: APIKEY,
        defaultHeaders: {
            'HTTP-Referer': "http://localhost", //for openrouter
            'X-Title': "Test App" //for openrouter
        },
    });
    while (true) {
        const res = await openai.chat.completions.create({
            model: "xiaomi/mimo-v2-flash:free",
            messages: [
                { role: "system", content: systemprompt },
                { role: "user", content: userprompt }
            ]
        });
        const data = res;
        console.log(res);
        if (data.choices[0].finish_reason === "stop") {
            return data.choices[0].message;
        }
        if (Date.now() - start > maxwaits) {
            throw new Error("Model failed to load in time");
        }
        await new Promise(r => setTimeout(r, 300));
    }
}
