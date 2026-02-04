import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    isscam: {
      type: Boolean,
      required: true
    },
    scam_type: {
      type: String
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    finalCallbackSent: {
      type: Boolean,
      default: false
    },
    extractedintel: [
      {
        upi_id: { type: String },
        bank_account: { type: String },
        phishing_link: { type: String }
      }
    ]
  },
  { timestamps: true }
);

const Report = mongoose.model("report", reportSchema);
export default Report;
