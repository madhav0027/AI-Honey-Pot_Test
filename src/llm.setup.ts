import axios from 'axios'
import { conversation } from './aiagent/conversation';

export async function runagent(systemprompt:string,userprompt:string) {
    
    const maxwaits = 8000;
    const start = Date.now()

    while(true){
        const res = await axios.post("http://localhost:11434/api/chat",{
            model:'dolphin-mistral',
            stream:false,
            messages:[
                {role:"system",content:systemprompt},
                {role:"user",content:userprompt}
            ]},{
                headers:{
                    'Content-Type':'application/json'
                },
            }
        )
        
        const data = res.data;
        
        console.log(data);      

    if(data.done_reason === "stop"){
        return data;
        
    }

     if (Date.now() - start > maxwaits) {
      throw new Error("Model failed to load in time");
    }

            
        await new Promise(r => setTimeout(r, 300));

    }
}