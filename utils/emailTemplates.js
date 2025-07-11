export const creatorCreated = (name, email, password) => {
  return `
    <div>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your account has been successfully created as a Creator.</p>
      <p><strong>Your login details are:</strong><br>
      Email: ${email}<br>
      Password: ${password}</p>
      <p>Please keep your password secure.</p>
      <p>Best Regards,<br>The Team</p>
    </div>
  `;
};

export const EmployeeCreated = (name, email, password) => {
  return `
        <p>Hello ${name},</p>
        <p>Your account has been successfully created as an Employee.</p>
        <p><strong>Login Details:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>Please keep your password secure.</p>
        <p>Best Regards,<br/>The Team</p>
  `;
};

export const resetPasswordEmailTemplaet = (verificationLink) => {
  const year = new Date().getFullYear();
  return `
  <div style="max-width:600px;margin:auto;padding:20px;font-family:Arial,sans-serif;text-align:center;
              border:1px solid #ddd;border-radius:10px;">
    <h2 style="color:#333;">Reset Your Password</h2>
    <p style="font-size:16px;color:#555;">
      Thanks for signing up! Click below to reset your password:
    </p>
    <a href="${verificationLink}"
       style="display:inline-block;padding:12px 24px;margin-top:10px;
              font-size:16px;color:#fff;background:#4CAF50;text-decoration:none;border-radius:5px;">
      Reset Password
    </a>
    <p style="font-size:14px;color:#777;margin-top:20px;">
      If you didn’t request this, just ignore this email.
    </p>
    <hr style="margin:20px 0;">
    <p style="font-size:12px;color:#999;">&copy; ${year} Your Company. All rights reserved.</p>
  </div>
  `;
};
