import { userDelete, userRoll } from "../libs/constant.js";
import User from "../modals/user.js";
import user from "../schema/user.js";
import CustomAppError from "../utils/error.js";
import { compareHash } from "../utils/service.js";
import { randomUUID } from "crypto";
import { generateHash, generatePass } from "../utils/service.js";
const getUserData = async (userId = "", email = "", option = {}) => {
  try {
    // console.log("Fetching user data with userId:", userId, "and email:", email);
    const user = await User.findOne(
      {
        $or: [{ userId }, { email }],
        $and: [{ isDeleted: userDelete.notDelete }],
      },
      option
    );
    // console.log("User data fetched:", user);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new CustomAppError("Database query failed");
  }
};

const verifyUser = async (data) => {
  const user = await getUserData("",data.email, {password:1,isverified:1});
  if (!user) {
    throw new CustomAppError("404 User not found");
  }
  const { password } = user;
  const isPasswordMatch = await compareHash(data.password, password);
  if (!isPasswordMatch) {
    throw new CustomAppError("401 Invalid password");
  }
  if(!user.isverified) {
    throw new CustomAppError("403 User not verified");
  }
  return true;
};

const createUser = async (userData) => {
  try {

    const userSchema = {};
    userSchema.userId = randomUUID();
    userSchema.roll = userRoll.user; 
    userSchema.name = userData.name;
    userSchema.email = userData.email;
    userSchema.isDeleted = userDelete.notDelete;
    userSchema.createdAt = new Date();
    userSchema.updatedAt = new Date();
    const passw = await generatePass();
    userSchema.password = await generateHash(passw);
    const newUser = new User(userSchema);
    return await newUser.save();

  } catch (error) {
    console.log(error)
    throw new CustomAppError("Database query failed");
  }
}

const getAllUsers = async (userId,option = {}) => {
  try {
    const users = await User.find(
      { isDeleted: userDelete.notDelete,userId: { $ne: userId } },
      option
    );
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new CustomAppError("Database query failed");
  }
};

const updateUser = async (userId,updatedData)=>{
  const user = await User.findOneAndUpdate({userId:userId},updatedData,{new:true});
  if (!user) {
    throw new CustomAppError("404 User not found");
  }
  return user;
}
export { getUserData, verifyUser, createUser, getAllUsers, updateUser };
