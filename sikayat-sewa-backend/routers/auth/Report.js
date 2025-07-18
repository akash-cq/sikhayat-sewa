import express from "express";
import  TakeReport  from "../../controller/Report.js";
import { getRequestById } from "../../controller/Request.js";
const router = express.Router();
router.get('/get/:requestId',async (req, res, next) => {
    try {
        const requestId = req.params.requestId;
        // console.log(requestId)
        if (!requestId) {
            return res.status(400).json({ error: "Request ID is required!" });
        }
        const userId = req.user.userId;
        const requestData = await getRequestById(requestId, { createdBy: 1 });
        if (!requestData) {
            return res.status(404).json({ error: "Request not found!" });
        }
        if (requestData.createdBy !== userId) {
            return res.status(403).json({ error: "You are not authorized to view this report!" });
        }
        const report = await TakeReport(requestId, { isDeleted: 0 });
        if (!report) {
            return res.status(404).json({ error: "Report not found!" });
        }
        res.status(200).json({ report });
    } catch (error) {
        console.log(error);
        next(error);
    }
});
export default router;