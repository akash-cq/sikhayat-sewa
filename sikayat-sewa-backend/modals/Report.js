import mongoose from "mongoose";

const ReporterSchema = new mongoose.Schema({
  name: {
    english: { type: String },
    hindi: { type: String },
  },
  ReporterId: { type: String, required: true},
  phoneNumber: { type: String },
  wardNumber: { type: String, required: true },
  problemsReported: [
    {
      category: [String],
      description: {
        english: String,
        hindi: String,
      },
    },
  ],
});

const ProblemSchema = new mongoose.Schema({
  problem: { type: String, required: true },
  categories: [{ type: String, required: true }],
  count: { type: Number, required: true },
  reporters: [ReporterSchema],
});

const WardWiseProblemSchema = new mongoose.Schema({
  ward: { type: String, required: true },
  problems: [ProblemSchema],
});

const AnalyticsSchema = new mongoose.Schema({
  ward: { type: String, required: true },
  totalProblems: { type: Number, required: true },
  categories: [
    {
      category: { type: String, required: true },
      count: { type: Number, required: true },
    },
  ],
});

const ReportSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      ref: "Request",
      unique: true,
    },
    ReportId:{
      type: String,
      required: true,
      unique: true,
    },
    summary: {
      totalProblems: Number,
      totalReporters: Number,
      mostCommonCategory: String,
    },
    commonProblems: [ProblemSchema], // Across all wards
    wardWiseProblems: [WardWiseProblemSchema],
    analytics: [AnalyticsSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
ReportSchema.index({ requestId: 1, ReportId: 1 }, { unique: true });
const Report = mongoose.model("Report", ReportSchema);
export default Report;
