import nodemailer from "nodemailer";

//function to add the user by the admin
export function buildVerificationEmail(name, email, password) {
  const year = new Date().getFullYear();
  return `
  <div style="max-width:600px;margin:auto;padding:20px;font-family:Arial,sans-serif;text-align:center;
              border:1px solid #ddd;border-radius:10px;">
    <h2 style="color:#333;">Congratulations! 🎉</h2>
    <p style="font-size:16px;color:#555;">
      Congratulations! ${name} your account have been created successfully! Following are the credentials to login:
    </p>
    Email: <strong>${email}</strong><br>
    Password: <strong>${password}</strong><br>
    <p style="font-size:14px;color:#777;margin-top:20px;">
      If you didn’t request this, just ignore this email.
    </p>
    <hr style="margin:20px 0;">
    <p style="font-size:12px;color:#999;">&copy; ${year} Your Company. All rights reserved.</p>
  </div>
  `;
}
// Transporter for sending emails
export const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // Use 587 if 465 doesn't work (465 is for SSL)
  secure: true, // true for 465, false for 587
  auth: {
    user: "info@ofmbase.com",
    pass: "Info123!!**",
  },
});
