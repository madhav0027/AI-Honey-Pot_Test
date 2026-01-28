import  express from "express";
import type { Request,Response } from "express";
import dotenv from "dotenv"
import { conversation } from "./aiagent/conversation";
import { classifer } from "./aiagent/classifer";
import { generateReport } from "./aiagent/report";
import cors from 'cors'
import { database } from "./db/db";
import Report from "./models/report";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let arr:any = [] ;
database();

app.use(cors({
    origin:"https://madhav0027.github.io/HoneypotaiFrontend/"
}))
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
    if(classified != null){
        const scamdata = JSON.parse(classified)
        const reportdata = new Report({isscam:scamdata.is_scam,confidence:scamdata.confidence})
        await reportdata.save()
        const conver = await conversation(message);
        const latestReport = await Report.findOne().sort({ createdAt: -1 });
        if(conver.content != null){
            const aireply = await JSON.parse(conver.content) 
            if(scamdata.confidence > 0.6 && scamdata.is_scam == true){
                if(message.includes("upi") || message.includes("pin") || message.includes("link") || message.includes("account")){          
                    const rep = await generateReport(message)
                    arr.push(rep);    
                    console.log("rep",rep)
                }
            }
            console.log("aireply",aireply)
            res.json({reply:aireply.reply,report:latestReport})
        }
    }

})

app.listen(PORT,() =>{
    console.log("Server is Running in PORT",PORT);
})