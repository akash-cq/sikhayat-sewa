import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    required: true,
    enum: [0, 1], // 0: User, 1: Admin,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  
}, { timestamps: true });

userSchema.index({ userId: 1, email: 1 }, { unique: true });
const User = mongoose.model("User", userSchema);

export default User;

