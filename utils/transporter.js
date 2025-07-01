import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // Use 587 if 465 doesn't work (465 is for SSL)
  secure: true, // true for 465, false for 587
  auth: {
    user: "info@ofmbase.com",
    pass: "Info123!!**",
  },
});
