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
    origin:"*"
}))
app.use(express.json())
app.get("/",(req:Request,res:Response) => {
    res.json({
        message:"Server is Running 😸😸"
    })
})

app.post('/message',async(req:Request,res:Response) => {
    const {message} = await req.body;
    let alert = "";

    console.log(message);
    const classified = await classifer(message);
    // console.log(classified)
    if(classified.content != null){
        const scamdata = JSON.parse(classified.content)
        const report = new Report({isscam:scamdata.is_scam,scam_type:scamdata.scam_type,extractedintel:[]})
        const conver = await conversation(message);
        if(conver.content != null){
            const aireply = await JSON.parse(conver.content) 
            if(scamdata.is_scam == true){
                if(message.includes("upi") || message.includes("pin") || message.includes("link") || message.includes("account") || message.includes("http")){          
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
            const latestReport = await Report.findOne()
                .where({isscam:true})
                .sort({ createdAt: -1 });
            // console.log("aireply",aireply)
            res.json({
                agent_response:aireply.reply,
                isscam:scamdata.is_scam ? latestReport?.isscam : '',
                scam_type:scamdata.is_scam ? latestReport?.scam_type : '',
                extractedintel:{
                    upi_id:scamdata.is_scam ? latestReport?.extractedintel[0].upi_id : null,
                    bank_account:scamdata.is_scam ? latestReport?.extractedintel[0].bank_account : null,   
                    phishing_link:scamdata.is_scam ? latestReport?.extractedintel[0].phising_link:null                
                }
            })
        }
    }

})

app.listen(PORT,() =>{
    console.log("Server is Running in PORT",PORT);
})