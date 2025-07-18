import * as fs from 'fs';
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import ejs from "ejs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const verfiedEmail = async(data)=>{
    console.log(__dirname, "dirname");
    const filePath = path.join(__dirname,"..", "views", "verify.ejs");
    console.log(filePath, "file path");
  
    if (!data.username || !data.verificationLink) {
      throw new Error("Username and email are required");
    }
    const emailContent=  await readEjsTemplate(filePath, data);
    if(!emailContent){
        throw new Error('Failed to read email template');
    }
    if(data.userEmail === undefined || data.userEmail === null){
        throw new Error('User email is required');
    }
    const mailPayload={
        to: data.userEmail,
        subject: "Email Verification",
        text: `Hello ${data.username}, please verify your email.`,
        html: emailContent
    }
    return mailPayload
}
const readEjsTemplate = (filepath,data)=>{
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, template) => {
        if (err) {
            reject(err);
        } else {
            const rendered = ejs.render(template, data);
            resolve(rendered);
        }
        });
    });
}

export default readEjsTemplate