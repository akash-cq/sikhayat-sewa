import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.js";
const generateAuthToken = (payload) => {
   const token = jwt.sign(payload, envConfig.SECRET_KEY, {
        expiresIn: "1d",
    });
    return token;
}   
const verifyAuthToken = (req,res,next) => {
    try {
        // console.log("error in token",req?.cookies?.token)
        const token = req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];
        if(!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, envConfig.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
export { generateAuthToken, verifyAuthToken };