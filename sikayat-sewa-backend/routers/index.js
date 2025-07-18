import express from "express";
const router = express.Router();
import authRouter from "./auth/userRoute.js";
import { verifyAuthToken } from "../utils/authToken.js";
import requestRouter from "./auth/Request.js";
import reportRouter from "./auth/Report.js";
router.use('/auth', authRouter);
router.use('/auth/request',verifyAuthToken, requestRouter);
router.use('/auth/report',verifyAuthToken,reportRouter)
export default router;