import bycrypt from "bcrypt";
const generateHash = async (password) => {
  try {
    const salt = await bycrypt.genSalt(10);
    const hash = await bycrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error("Error generating hash:", error);
    throw new CustomAppError("Hash generation failed");
  }
};

const compareHash = async (password, hash) => {
  try {
    const isMatch = await bycrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error("Error comparing hash:", error);
    throw new CustomAppError("Hash comparison failed");
  }
};
const generatePass = async () => {
    const passChars = "QWERTYUIOPASDFGHJKLZXCVBNM7418952630~!@#$%^&*()+qazxcvbnmwsdfgertyhjklpoiu";
    let password = "";
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * passChars.length);
        password += passChars[randomIndex];
    }
    console.log(password, "Generated Password");
    return password;
};
export { generateHash, compareHash, generatePass };