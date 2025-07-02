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
