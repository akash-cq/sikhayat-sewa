import { connectDB } from "./config/dbconfig.js";
import User from "./modals/user.js";
import { generateHash } from "./utils/service.js";

const createAdmin = async () => {
  try {
    await connectDB();
      const newAdmin = new User({
        userId: "admin001",
        roll: 1,
        name: "Admin",
        email: "admin@example.com",
        password: await generateHash("Admin@123"),
      });
      await newAdmin.save();
      console.log("Admin created successfully");
   
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};
createAdmin()
  .then(() => console.log("Admin seeding completed"))
  .catch((error) => console.error("Error during admin seeding:", error));
