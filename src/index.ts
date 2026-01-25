import  express from "express";
import type { Request,Response } from "express";
import dotenv from "dotenv"
import { conversation } from "./aiagent/conversation";
import { classifer } from "./aiagent/classifer";
import { generateReport } from "./aiagent/report";
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let arr:any = [] ;

app.use(cors())
app.use(express.json())
app.get("/",(req:Request,res:Response) => {
    res.json({
        message:"Server is Running 😸😸"
    })
})

app.post('/message',async(req:Request,res:Response) => {
    const {message} = await req.body;

    console.log(message);
    const classified = await classifer(message);
    const scamdata = JSON.parse(classified.message.content)
    // if(classified === "NO_SCAM_DETECTED")
    //     res.json({message:"No_Scam_detected in this message "+message})
    
    const conver = await conversation(message);
    if(scamdata.confidence > 0.6 && scamdata.is_scam == true){
       if(message.includes("upi") || message.includes("pin") || message.includes("link") || message.includes("account")){          
           const rep = await generateReport(message)
           arr.push(rep);    
           console.log("rep",rep)
        }
    }
        res.json(conver)
    console.log("classified ",classified)
    console.log("arr ",arr[0])

})

app.listen(PORT,() =>{
    console.log("Server is Running in PORT",PORT);
})