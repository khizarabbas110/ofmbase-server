// emailService.js
import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (toEmail, htmlContent, emailSubject) => {
  try {
    const response = await resend.emails.send({
      from: "OFMBase <info@ofmbase.com>",
      to: toEmail,
      subject: emailSubject,
      html: htmlContent,
    });

    console.log("✅ Email sent via Resend:", response);
    return response;
  } catch (err) {
    console.error("❌ Failed to send email via Resend:", err);
    throw err;
  }
};
