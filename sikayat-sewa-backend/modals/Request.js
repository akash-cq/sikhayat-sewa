import mongoose from "mongoose";
import { de } from "zod/v4/locales";
const RequestSchema = new mongoose.Schema({
    RequestId:{
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 0,
    },
    createdBy:{
        type: String,
        required: true,
    },
    url:{
        type: String,
        required: false,
    },
    docCount:{
        type: Number,
        default: 0,
    },
    documentsOf: [],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
    updatedAt: {
        type: Date,
        default: Date.now,
    }, 
});

RequestSchema.index({ RequestId: 1 }, { unique: true });
const Request = mongoose.model("Request", RequestSchema);
export default Request;
