import { requestDelete, requestStatus } from "../libs/constant.js";
import Request from "../modals/Request.js";
import { randomUUID } from "crypto";
import CustomAppError from "../utils/error.js";
import { getDataFromGeminiAi, getReportFromGeminiAi } from "./Ai.js";
import Complaint from "../modals/Complaints.js";
import Report from "../modals/Report.js";
const createRequest = async (data) => {
  const RequestSchema = {};
  RequestSchema.RequestId = randomUUID();
  RequestSchema.title = data.title;
  RequestSchema.description = data.description;
  RequestSchema.status = 0;
  RequestSchema.createdBy = data.userId;
  RequestSchema.isDeleted = false;
  RequestSchema.docCount = 0;
  RequestSchema.documentsOf = [];
  RequestSchema.url = data.url;
  RequestSchema.createdAt = new Date();
  RequestSchema.updatedAt = new Date();
  const request = await Request.create(RequestSchema);
  await request.save();
  return request;
};

const getRequestData = async (userId = "", option = {}) => {
  const request = await Request.find(
    { createdBy: userId, isDeleted: requestDelete.notDelete },
    option
  );
  if (!request || request.length === 0) {
    return null;
  }
  return request;
};
const getRequestById = async (RequestId, option = {}) => {
  const request = await Request.findOne(
    { RequestId, isDeleted: requestDelete.notDelete },
    option
  );
  if (!request) {
    throw new CustomAppError("404 Request not found");
  }
  return request;
};
const updateRequest = async (RequestId, updateData) => {
  const request = await Request.findOneAndUpdate(
    { RequestId, isDeleted: requestDelete.notDelete },
    updateData,
    { new: true }
  );
  if (!request) {
    throw new CustomAppError("404 Request not found");
  }
  return request;
};
const createReportSchema = async (report, requestId) => {
  try {
    const reportSchema = report;
    reportSchema.requestId = requestId || "Unknown";
    reportSchema.ReportId = randomUUID();
    const reportRegister = await Report.create(reportSchema);
    await reportRegister.save();
    // console.log(reportRegister, "report created successfully");
    return reportRegister;
  } catch (error) {
    console.log(error);
    throw new CustomAppError("Failed to create report schema");
  }
};

const GenrateSummary = async (data) => {
  try {
    const summary = await getDataFromGeminiAi(data);
    if (!summary || summary.length === 0) {
      throw new CustomAppError("Failed to generate summary");
    }
    const ComplaintData = [];
    const ComplaintIds = [];
    for (const item of summary) {
      item.RequestId = data.RequestId;
      // console.log(data.RequestId, "requestId from gemini");
      const complaint = await createComplaintSchema(item);
      ComplaintData.push(complaint);
      ComplaintIds.push(complaint.complaintId);
    }

    const Report = await getReportFromGeminiAi(ComplaintData);
    console.log(Report, "report from gemini");
    if (!Report || Report.length === 0) {
      throw new CustomAppError("Failed to generate report");
    }
    console.log(Report, "report from gemini");
    const reportData = await createReportSchema(Report, data.RequestId);
    // console.log(reportData, "report created successfully");
    // Update the request with the generated complaints
    const updatedRequest = await updateRequest(data.RequestId, {
      status: requestStatus.completed,
      docCount: ComplaintData.length,
      documentsOf: ComplaintIds,
    });
  } catch (error) {
    updateRequest(data.RequestId, {
      status: requestStatus.pending,
    });
    console.log(error);
  }
};


async function createComplaintSchema (object) {
  try {
    // console.log(object, "object from gemini");
    const complaintSchema = {};
    complaintSchema.complaintId = randomUUID();
    complaintSchema.NameInEnglish = object.NameInEnglish || "Unknown";
    complaintSchema.NameInHindi = object.NameInHindi || "Unknown";
    complaintSchema.MobileNo = object.MobileNo || "";
    complaintSchema.WardNo = object.WardNo || "Not Provided";
    complaintSchema.ComplaintTag = object.ComplaintTag || [];
    complaintSchema.ProblemCount = object.ProblemCount || 0;
    complaintSchema.Problems = object.Problems || [
      {
        text: {
          hindi: "",
          english: "",
        },
        tag: "Unknown",
      },
    ];
    complaintSchema.RequestId = object.RequestId || "Unknown";
    complaintSchema.isDeleted = false;
    const complaintRegister = await Complaint.create(complaintSchema);
    await complaintRegister.save();
    return complaintRegister;
  } catch (error) {
    console.log(error);
    throw new CustomAppError("Failed to create complaint schema");
  }
}


const getComplaints = async(request)=>{
  try {
    
    const complaints = await Complaint.find(
      { RequestId: request.RequestId, isDeleted: requestDelete.notDelete },
      {
        complaintId: 1,
        NameInEnglish: 1,
        NameInHindi: 1,
        MobileNo: 1,
        WardNo: 1,
        ComplaintTag: 1,
        ProblemCount: 1,
        Problems: 1,
        RequestId: 1,
        isDeleted: 1,
      }
    );
    if (!complaints || complaints.length === 0) {
      throw new CustomAppError("No complaints found for this request");
    }
    // console.log(complaints, "complaints from db");
    return complaints;
  } catch (error) {
    console.log(error);
    throw new CustomAppError("Failed to get complaints");
  }
}


const getOneComplaint = async (request) => {
  try {
    const complaints = await Complaint.findOne(
      { complaintId: request.complaintId, isDeleted: requestDelete.notDelete },
      {
        complaintId: 1,
        NameInEnglish: 1,
        NameInHindi: 1,
        MobileNo: 1,
        WardNo: 1,
        ComplaintTag: 1,
        ProblemCount: 1,
        Problems: 1,
        RequestId: 1,
        isDeleted: 1,
      }
    );
    if (!complaints ) {
      throw new CustomAppError("No complaints found for this request");
    }
    // console.log(complaints, "complaints from db");
    return complaints;
  } catch (error) {
    console.log(error);
    throw new CustomAppError("Failed to get complaints");
  }
};
export {
  createRequest,
  getRequestData,
  getRequestById,
  updateRequest,
  GenrateSummary,
  getComplaints,
  getOneComplaint,
  createReportSchema,
};
