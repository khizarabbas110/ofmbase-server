import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // ✅ Hostinger SMTP server
  port: 465, // ✅ SSL port
  secure: true, // ✅ Use SSL
  auth: {
    user: process.env.EMAIL_USER, // info@ofmbase.com
    pass: process.env.EMAIL_PASS, // Info123!!**
  },
});
