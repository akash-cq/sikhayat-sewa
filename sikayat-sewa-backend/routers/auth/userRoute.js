import express from "express";
import { createUser, getAllUsers, getUserData, updateUser, verifyUser } from "../../controller/user.js";
import { generateAuthToken, verifyAuthToken } from "../../utils/authToken.js";
import { cookiesConfig } from "../../config/authconfig.js";
import { checkAdmin } from "../../middlewares/User.js";
import schemas from "../../schema/user.js";
import { userDelete } from "../../libs/constant.js";
import { verfiedEmail } from "../../controller/Email.js";
import { sendMail } from "../../utils/mail.js";
import { randomUUID } from "crypto";
import { name } from "ejs";
const { LoginSchema, userCreationSchema }  = schemas;
const router = express.Router();
router.post("/login", async (req, res, next) => {
  try {
    // console.log(req.body);
    const data = LoginSchema.safeParse(req.body);
    // console.log(data.data);
    if (!data.success) {
      return res.status(400).json({ message: data.error.errors[0].message });
    }
    const isValidUser = await verifyUser(data.data);
    if (!isValidUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const userData = await getUserData("", data?.data?.email, {
      password: 0,
      isDeleted: 0,
    });
    const payload = {
      userId: userData.userId,
      email: userData.email,
      roll: userData.roll,
      name: userData.name,
      isVerified: userData.isverified,
    };
    const token = generateAuthToken(payload);
    res.cookie("token", token, cookiesConfig);
    return res.status(200).json({
      message: "Login successful",
      token: token,
      userData: {
        userId: userData.userId,
        email: userData.email,
        name: userData.name,
        roll: userData.roll,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/session", verifyAuthToken, async (req, res,next) => {
  try {
    const { userId } = req.user;
    const userData = await getUserData(userId, "", {
      userId: 1,
      email: 1,
      roll: 1,
      name: 1,
    });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ userData: userData });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  "/add/user",
  verifyAuthToken,
  checkAdmin,
  async (req, res, next) => {
    try {
      const data = userCreationSchema.safeParse(req.body);
      if (!data.success) {
        return res.status(400).json({ message: data.error.errors[0].message });
      }

      const { name, email } = data.data;
      const existingUser = await getUserData("", email, {});
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      const payload = {
        name: data.data.name,
        email: data.data.email,
      };

      const newUser = await createUser(payload);
      if (!newUser) {
        return res.status(500).json({ message: "Failed to create user" });
      }
      const verificationToken = randomUUID();
      const verificationLink = `http://localhost:3000/auth/verified/email/${verificationToken}?userid=${newUser.userId}`;
      await updateUser(newUser.userId, {
        verificationToken: verificationToken,
        isverified: false,
      });

      const userEmailPayload = {

        userEmail: newUser.email,
        username: newUser.name,
        verificationLink: verificationLink,
      };
      const getPage = await verfiedEmail(userEmailPayload);
     
      getPage.from={
        name: "Sikayat Sewa",
        email: "akash.2024dev@gmail.com"
      }
      const mailResponse = await sendMail(getPage);
      if (!mailResponse) {
        return res.status(500).json({ message: "Failed to send verification email" });
      }
      return res.json({
        message: "User created successfully",
        userData: {
          userId: newUser.userId,
          email: newUser.email,
          roll: newUser.roll,
          name: newUser.name,
          isVerified: newUser.isverified,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);


router.get("/get/all/users", verifyAuthToken, checkAdmin, async (req, res, next) => {
  try {
    const users = await getAllUsers(req.user.userId,{
      userId: 1,
      email: 1,
      roll: 1,
      name: 1,
      isverified: 1,
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "404 No users found" });
    }
    return res.json({ users });
  } catch (error) {
    console.log(error);
    next(error);
  }
});


router.delete('/delete/user/:userId',verifyAuthToken,checkAdmin, async (req, res, next) => {
  try {
    const {userId} = req.params;
    const user = await getUserData(userId, "", { userId: 1,email:1 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const emailDelete = user.email + '-deleted-'+user.userId;
    const deletePayload = {
      isDeleted: userDelete.delete,
      email: emailDelete,
    };
    const deleteUser = await updateUser(userId, deletePayload);
    if (!deleteUser) {
      return res.status(500).json({ message: "Failed to delete user" });
    }
    return res.json({ message: "User deleted successfully", userId: deleteUser.userId });
    
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.get('/verified/email/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const userid = req.query.userid
    console.log(userid)
    const user = await getUserData(userid,"", {
      email: 1,
      verificationToken: 1,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verificationToken !== token) {
      return res.status(400).json({ message: "Invalid verification token" });
    }
    const mailPayload = await updateUser(userid,{
      isverified: true,
      verificationToken: "",
    });
    console.log(mailPayload, "mailPayload");
    return res.json({ message: "successfully email verified" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
