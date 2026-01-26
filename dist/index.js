"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const conversation_1 = require("./aiagent/conversation");
const classifer_1 = require("./aiagent/classifer");
const report_1 = require("./aiagent/report");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
let arr = [];
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        message: "Server is Running 😸😸"
    });
});
app.post('/message', async (req, res) => {
    const { message } = await req.body;
    console.log(message);
    const classified = await (0, classifer_1.classifer)(message);
    if (classified != null) {
        const scamdata = JSON.parse(classified);
        const conver = await (0, conversation_1.conversation)(message);
        if (conver.content != null) {
            const aireply = await JSON.parse(conver.content);
            if (scamdata.confidence > 0.6 && scamdata.is_scam == true) {
                if (message.includes("upi") || message.includes("pin") || message.includes("link") || message.includes("account")) {
                    const rep = await (0, report_1.generateReport)(message);
                    arr.push(rep);
                    console.log("rep", rep);
                }
            }
            console.log("aireply", aireply);
            res.json(aireply.reply);
        }
    }
});
app.listen(PORT, () => {
    console.log("Server is Running in PORT", PORT);
});
