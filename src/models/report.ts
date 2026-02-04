import mongoose from "mongoose";

const report = new mongoose.Schema(
    {
        isscam:{
            type:String
        },
        scam_type:{
            type:String
        },
        extractedintel:[
            {
                upi_id:{
                    type:String
                },
               bank_account:{
                    type:String
                },
               phising_link:{
                    type:String
                }                
            }
        ]
    },
    {timestamps:true}
);

const Report = mongoose.model("report",report)
export default Report;