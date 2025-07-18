import mongoose from "mongoose";
import { envConfig } from "./env.js";
const dbConfig = {
  url: envConfig.DB_URL || "mongodb://localhost:27017/sikayat-sewa",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
const connectDB = async () => {
  try {
    // console.log(envConfig)
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  }
};
export { connectDB, dbConfig };