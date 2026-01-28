import mongoose from "mongoose";

const report = new mongoose.Schema(
    {
        isscam:{
            type:String
        },
        confidence:{
            type:String
        }
    },
    {timestamps:true}
);

const Report = mongoose.model("report",report)
export default Report;