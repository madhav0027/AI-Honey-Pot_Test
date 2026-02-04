import  express from "express";
import type { Request,Response } from "express";
import dotenv from "dotenv"
import { conversation } from "./aiagent/conversation";
import { classifer } from "./aiagent/classifer";
import { generateReport } from "./aiagent/report";
import cors from 'cors'
import { database } from "./db/db";
import Report from "./models/report";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let arr:any = [] ;
database();

app.use(cors({
    origin:"*"
}))
app.use(express.json())
app.get("/",(req:Request,res:Response) => {
    res.json({
        message:"Server is Running 😸😸"
    })
})

app.post('/message',async(req:Request,res:Response) => {
    
    const apiKey = req.headers["x-api-key"];    
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { sessionId, message, conversationHistory, metadata } = req.body;    
    if (!sessionId || !message?.text) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // console.log(message);
    const text = message.text.toLowerCase();
    const classified = await classifer(message);
    // console.log(classified)
    if(classified.content != null){
        const scamdata = JSON.parse(classified.content)
        let report = await Report.findOne({sessionId})
        if(!report){
            report = new Report({sessionId:sessionId,isscam:scamdata.is_scam,
                scam_type:scamdata.scam_type,
                extractedintel:[],
                totalMessages:0,
                finalCallbackSent:false})
        }
        report.totalMessages += 1;
        const conver = await conversation(message,conversationHistory,metadata);
        if(!conver.content){
         return res.json({ status: "success", reply: "Sorry can't talk right now." });
        }
            const aireply = await JSON.parse(conver.content) 
            if(scamdata.is_scam == true){
                if(text.includes("upi") || text.includes("pin") || text.includes("link") || text.includes("account") || text.includes("http")){          
                    const rep = await generateReport(message)
                    if(rep.content){
                        const reportdata = JSON.parse(rep.content)
                        report.extractedintel.push({
                            upi_id:reportdata.upi_id,
                            bank_account:reportdata.bank_account,
                            phising_link:reportdata.phishing_link
                        })
                        await report.save()
                    }
                }
            }

            if(report.isscam &&
                report.totalMessages >= 10 
                &&  report.extractedintel.length > 0 
                && !report.finalCallbackSent
            ){
                await axios.post(
                    "https://hackathon.guvi.in/api/updateHoneyPotFinalResult",
                    {
                        sessionId:report.sessionId,
                        scamDetected:true,
                        totalMessageExchange:report.totalMessages,
                         extractedIntelligence: {
                            bankAccounts: report.extractedintel
                            .map(i => i.bank_account)
                            .filter(Boolean),
                            upiIds: report.extractedintel
                            .map(i => i.upi_id)
                            .filter(Boolean),
                            phishingLinks: report.extractedintel
                            .map(i => i.phishing_link)
                            .filter(Boolean),  phoneNumbers: [],
                        suspiciousKeywords: ["urgent", "verify", "account blocked"]
                    },
                    agentNotes: "Scammer used urgency and payment redirection tactics"
                    },
                    {timeout:5000}
                )

                report.finalCallbackSent =true
            }
            await report.save()

            // console.log("aireply",aireply)
            res.json({
                status:"success",
                reply:aireply.reply
            })
    }

})

app.listen(PORT,() =>{
    console.log("Server is Running in PORT",PORT);
})