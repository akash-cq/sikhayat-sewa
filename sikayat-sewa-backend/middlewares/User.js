import { userRoll } from "../libs/constant.js";

const checkAdmin = async(req,res,next)=>{
    try {
        if(req.user.roll !== userRoll.admin){
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    } catch (error) {
        console.error("Error in checkAdmin middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export { checkAdmin };