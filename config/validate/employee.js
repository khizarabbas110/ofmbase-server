export const createEmployeeValidation = {
  name: {
    required: true,
    type: String,
    message: "Employee name is required",
  },
  email: {
    required: true,
    type: String,
    message: "Valid email is required",
  },
  role: {
    required: true,
    type: String,
    message: "Role is required",
  },
  status: {
    required: false,
    type: String,
    message: "Status should be a valid string",
  },
  hourly_rate: {
    required: false,
    type: String, // Change to Number if needed
    message: "Hourly rate must be a string",
  },
  payment_method: {
    required: true,
    type: String,
    message: "Payment method is required",
  },
  paypal_email: {
    required: false,
    type: String,
    message: "Paypal email is required when payment method is paypal",
  },
  payment_schedule: {
    required: true,
    type: String,
    message: "Payment schedule is required",
  },
};
