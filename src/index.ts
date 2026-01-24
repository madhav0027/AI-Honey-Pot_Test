import  express from "express";
import type { Request,Response } from "express";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.get("/",(req:Request,res:Response) => {
    res.json({
        message:"Server is Running 😸😸"
    })
})

app.listen(PORT,() =>{
    console.log("Server is Running in PORT",PORT);
})