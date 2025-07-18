import express from 'express';
import cors from "cors";
import { envConfig } from './config/env.js';    
import CustomAppError from './utils/error.js';
import { connectDB } from './config/dbconfig.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
connectDB();
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors(
    {
        origin: envConfig.FRONT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],

    }
));
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory
app.use('/',router)
app.use((err, req, res, next) => {
  if (err instanceof CustomAppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    // Handle other internal errors
    res.status(500).json({
      message: "Something unexpected happened!",
    });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
