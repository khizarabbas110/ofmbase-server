import nodemailer from "nodemailer";
import "dotenv/config"; // ensure dotenv is loaded

export const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // or 587 if needed
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
