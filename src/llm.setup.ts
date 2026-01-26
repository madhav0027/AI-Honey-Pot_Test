import axios from 'axios'
import { conversation } from './aiagent/conversation';
import OpenAi from "openai"

export async function runagent(systemprompt:string,userprompt:string) {
    
    const maxwaits = 8000;
    const start = Date.now()


    const APIKEY = process.env.APIKEY;

    const openai = new OpenAi({
          baseURL: "https://openrouter.ai/api/v1",
         apiKey:APIKEY,
         defaultHeaders: {
                    'HTTP-Referer':"http://localhost", //for openrouter
                    'X-Title':"Test App" //for openrouter
        },
    })

    while(true){
        const res = await openai.chat.completions.create({
            model:"xiaomi/mimo-v2-flash:free",
            messages:[
                {role:"system",content:systemprompt},
                {role:"user",content:userprompt}
            ]                            
        })
                    
        const data = res;
        
        console.log(res);      

    if(data.choices[0].finish_reason === "stop"){
        return data.choices[0].message;
        
    }

     if (Date.now() - start > maxwaits) {
      throw new Error("Model failed to load in time");
    }

            
        await new Promise(r => setTimeout(r, 300));

    }
}