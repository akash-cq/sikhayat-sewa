    import multer from "multer";
    import { randomUUID } from "crypto";
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // console.log(file,"refb ")
            cb(null, "./uploads");
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = randomUUID();
            const safeOriginalName = file.originalname.replace(/\s+/g, "_");
            cb(null, file.fieldname + "-" + uniqueSuffix + "-" + safeOriginalName);
        }
    })
    const fileFilter = (req, file, cb) => {
        const allowedTypes = ["application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"), false);
        }
    
    }
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 10 
        }
    });
    export default upload;