import express from "express";
import upload from "../../middlewares/Multer.js";
// import { verifyAuthToken } from '../../utils/authToken.js';
import RequestsData from "../../schema/Request.js";
import {
  createRequest,
  GenrateSummary,
  getComplaints,
  getOneComplaint,
  getRequestById,
  getRequestData,
  updateRequest,
} from "../../controller/Request.js";
import { getDataFromGeminiAi } from "../../controller/Ai.js";
import { requestDelete, requestStatus } from "../../libs/constant.js";
const router = express.Router();

router.post("/add", upload.single("document"), async (req, res, next) => {
  try {
    // console.log(req.file, req.body.document);
    const data = {
      fileName: req.file.filename,
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId,
    };
    // console.log(data);
    const requestData = RequestsData.safeParse(data);
    // console.log(requestData);
    // console.log(requestData);
    if (requestData.success === false) {
      return res.status(400).json({ error: requestData.error });
    }
    data.url = `http://localhost:3000/uploads/${req.file.filename}`;
    const request = await createRequest(data);
    if (!request) {
      return res
        .status(500)
        .json({ error: "Failed to create Request try again!" });
    }
    return res
      .status(200)
      .json({ message: "Request received successfully", request });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/get/all/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required!" });
    }
    const request = await getRequestData(userId, {
      RequestId: 1,
      title: 1,
      description: 1,
      status: 1,
      createdBy: 1,
      url: 1,
      docCount: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    if (!request || request.length === 0) {
      return res
        .status(404)
        .json({ error: "No requests found for this user!" });
    }
    return res
      .status(200)
      .json({ message: "Requests fetched successfully", requests: request });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/generate/ai/:requestId", async (req, res, next) => {
  try {
    const { userId } = req.body;
    const requestId = req.params.requestId;
    const isCreater = await getRequestById(requestId, {
      createdBy: 1,
      RequestId: 1,
      url: 1,
    });
    // console.log(isCreater, userId);
    if (!isCreater || isCreater.createdBy !== userId) {
      return res.status(403).json({
        error: "You are not authorized to generate AI Report for this request!",
      });
    }
    const updatedData = await updateRequest(requestId, {
      status: requestStatus.inProgress,
    });
    // console.log(updatedData);
    res.status(200).json({
      message: "AI summary generated successfully",
      updatedData,
    });
    GenrateSummary(isCreater);
  } catch (error) {
    console.log(error);
    updateRequest(requestId, {
      status: requestStatus.pending, // Assuming 1 means in progress
    });
    next(error);
  }
});
router.delete("/delete/:requestId", async (req, res, next) => {
  try {
    const requestId = req.params.requestId;
    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required!" });
    }
    const request = await getRequestById(requestId, { createdBy: 1 });
    if (request.createdBy !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this request!" });
    }
    await updateRequest(requestId, { isDeleted: requestDelete.delete });
    return res.status(200).json({ message: "Request deleted successfully!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/get/complaints/:requestId", async (req, res, next) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.user.userId
    // console.log(requestId, "requestId from params");
    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required!" });
    }
    const request = await getRequestById(requestId, {
      documentsOf: 1,
      RequestId: 1,
      createdBy:1,
    });
    if( request.createdBy !== userId) {
      return res.status(403).json({ error: "You are not authorized to view this request's complaints!" });
    }
    if (!request || request.isDeleted) {
      return res.status(404).json({ error: "Request not found!" });
    }
  
    const complaints = await getComplaints(request);

    if (!complaints || complaints.length === 0) {
      return res
        .status(404)
        .json({ error: "No complaints found for this request!" });
    }
    const complaintsArr = [];
    for (let object of complaints) {
      const payload = {
        nameInEnglish: object.NameInEnglish,
        nameInHindi: object.NameInHindi,
        mobileNo: object.MobileNo,
        ward: object.WardNo.includes("Ward")
          ? object.WardNo.replace(/\D/g, "")
          : object.WardNo,
        problemsCount: object.ProblemCount,
        problems: object.Problems,
        tags: object.ComplaintTag,
        complaintId: object.complaintId,
        RequestId: object.RequestId,
      };
      complaintsArr.push(payload);
    }
    return res
      .status(200)
      .json({ message: "Complaints fetched successfully", complaintsArr });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/get/complaints/:requestId/:complaintId", async (req, res, next) => {
  try {
    const requestId = req.params.requestId;
    const complaintId = req.params.complaintId;
    // console.log(requestId, "requestId from params");
    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required!" });
    }
    const fetchPayload = {
      complaintId: complaintId,
      RequestId: requestId,
    }
    const userId = req.user.userId;
    const request = await getRequestById(requestId, {
      documentsOf: 1,
      RequestId: 1,
      createdBy: 1,
    });
    if (request.createdBy !== userId) {
      return res.status(403).json({ error: "You are not authorized to view this request's complaints!" });
    }
    const complaints = await getOneComplaint(fetchPayload);

    if (!complaints) {
      return res
        .status(404)
        .json({ error: "No complaints found for this request!" });
    }
    const payload = {
      nameInEnglish: complaints.NameInEnglish,
      nameInHindi: complaints.NameInHindi,
      mobileNo: complaints.MobileNo,
      ward: complaints.WardNo.includes("Ward")
        ? complaints.WardNo.replace(/\D/g, "")
        : complaints.WardNo,
      problemsCount: complaints.ProblemCount,
      problems: complaints.Problems,
      tags: complaints.ComplaintTag,
      complaintId: complaints.complaintId,
      RequestId: complaints.RequestId,
    };
    // console.log(payload, "payload from getOneComplaint");
    return res
      .status(200)
      .json({ message: "Complaints fetched successfully", complaint:payload });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
export default router;
