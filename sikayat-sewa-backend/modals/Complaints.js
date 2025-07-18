import mongoose from "mongoose";
import { string } from "zod/v4";
const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    NameInEnglish: {
      type: String,
      required: true,
    },
    NameInHindi: {
      type: String,
      required: true,
    },
    MobileNo: {
      type: String,
    },
    WardNo: {
      type: String,
      default: "Not Provided",
    },
    ComplaintTag: [{ type: String }],
    ProblemCount: {
      type: Number,
      default: 0,
    },
    Problems: [
      {
        text: {
          hindi: String,
          english: String,
        },
        tag: String || null,
      },
    ],
    RequestId: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
complaintSchema.index({ complaintId: 1 }, { unique: true });
const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
