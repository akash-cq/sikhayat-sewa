import nodemailer from 'nodemailer';
import { mailConfig } from '../config/env.js';
const Transport = nodemailer.createTransport({
  host: mailConfig.SMTP_HOST,
  port: mailConfig.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: mailConfig.SMTP_USER,
    pass: mailConfig.SMTP_PASS,
  },
});
  

const sendMail = async (data) => {
    console.log(mailConfig, "mail config");
  try {
    const mailOptions = {
      from: mailConfig.SMTP_USER,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html
    };
    const info = await Transport.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
export { sendMail };