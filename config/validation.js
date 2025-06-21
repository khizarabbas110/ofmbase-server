// doctorValidationRules.js
export const registerUserValidation = {
  email: {
    required: true,
    type: "email",
    message: "Valid email is required",
  },
  password: {
    required: true,
    type: String,
    message: "Password is required",
  },
  method: {
    required: true,
    type: String,
    enum: ["custom", "gmail"],
    message: "Method must be either 'custom' or 'gmail'",
    default: "custom",
  },
};


export const loginAdminValidation = {
  email: {
    required: true,
    type: "email",
    message: "Email address is required",
  },
  password: {
    required: true,
    message: "Password is required",
  },
};

export const postGeneralSalesTaxValidation = {
  businessName: {
    required: true,
    type: "string",
    message: "Business name is required",
  },
  businessType: {
    required: true,
    type: "string",
    enum: ["Company/NPO", "AOP/Partnership", "Individual/Sole Proprietors"],
    message:
      "Business type is required and must be one of: 'Company/NPO', 'AOP/Partnership', or 'Individual/Sole Proprietors'",
  },
  startDate: {
    required: true,
    type: "date",
    message: "Start date is required",
  },
  businessNature: {
    required: true,
    type: "string",
    enum: [
      "Company/NPO",
      "Retailer",
      "Manufacturer",
      "Wholesaler Distributor",
      "Commercial Importer",
      "Exporter",
      "Other",
    ],
    message:
      "Business nature is required and must be one of the allowed values",
  },
  description: {
    required: true,
    type: "string",
    message: "Description is required",
  },
  consumerNumber: {
    required: true,
    type: "string",
    message: "Consumer number is required",
  },
};

const dateFormatRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

export const personalProfileValidation = {
  email: {
    required: true,
    type: "email",
    message: "Email address is required and must be a valid email",
  },
  phone: {
    required: true,
    type: "string",
    message: "Phone number is required",
  },
  presentAddress: {
    required: true,
    type: "string",
    message: "Present address is required",
  },
  pin: {
    required: true,
    type: "string",
    message: "PIN code is required",
  },
  password: {
    required: true,
    type: "string",
    message: "Password is required",
  },
};

export const businessIncorporationValidation = {
  irisPinOrPassword: {
    required: true,
    type: "boolean",
    message: "irisPinOrPassword is required",
  },
  purposeOfBusiness: {
    required: true,
    type: "string",
    message: "Purpose of business is required",
  },
  businessName: {
    required: true,
    type: "string",
    message: "Business name is required",
  },
  email: {
    required: true,
    type: "email",
    message: "Valid email address is required",
  },
  phone: {
    required: true,
    type: "string",
    message: "Phone number is required",
  },
  pin: {
    required: (data) => Boolean(data.irisPinOrPassword), // Ensures it's only required if true
    type: "string",
    message: "Pin is required when irisPinOrPassword is true",
  },
  password: {
    required: (data) => Boolean(data.irisPinOrPassword), // Ensures it's only required if true
    type: "string",
    message: "Password is required when irisPinOrPassword is true",
  },
};

export const customValidator = (schema) => (req, res, next) => {
  const errors = [];

  // Loop through schema to validate fields
  Object.keys(schema).forEach((field) => {
    const rule = schema[field];
    const value = req.body[field];

    // Check required fields
    if (rule.required && (value === undefined || value === "")) {
      errors.push({ field, message: rule.message });
    }

    // Type validation
    if (rule.type === "boolean" && typeof value !== "boolean") {
      errors.push({ field, message: `${field} must be a boolean` });
    }

    if (
      rule.type === "string" &&
      value !== undefined &&
      typeof value !== "string"
    ) {
      errors.push({ field, message: `${field} must be a string` });
    }

    if (rule.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      errors.push({ field, message: "Invalid email format" });
    }
  });

  // Additional Custom Logic for `pin` and `password`
  if (req.body.irisPinOrPassword === true) {
    if (!req.body.pin) {
      errors.push({
        field: "pin",
        message: "Pin is required when irisPinOrPassword is true",
      });
    }
    if (!req.body.password) {
      errors.push({
        field: "password",
        message: "Password is required when irisPinOrPassword is true",
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const forgotPasswordValidation = {
  email: {
    required: true,
    type: "email",
    message: "Email address is required and must be a valid email",
  },
};

export const updateSetup = {
  phone: {
    required: true,
    type: "string",
    message: "Phone number is required",
  },
  cnic: {
    required: true,
    type: "string",
    message: "CNIC is required",
  },
};

export const updateGeneralSalesTaxValidation = {
  businessName: {
    required: false, // Optional for update
    type: "string",
    message: "Business name must be a string",
  },
  businessType: {
    required: false,
    type: "string",
    enum: ["Company/NPO", "AOP/Partnership", "Individual/Sole Proprietors"],
    message:
      "Business type must be one of: 'Company/NPO', 'AOP/Partnership', or 'Individual/Sole Proprietors'",
  },
  startDate: {
    required: false,
    type: "date",
    message: "Start date must be a valid date",
  },
  businessNature: {
    required: false,
    type: "string",
    enum: [
      "Company/NPO",
      "Retailer",
      "Manufacturer",
      "Wholesaler Distributor",
      "Commercial Importer",
      "Exporter",
      "Other",
    ],
    message: "Business nature must be one of the allowed values",
  },
  description: {
    required: false,
    type: "string",
    message: "Description must be a string",
  },
  consumerNumber: {
    required: false,
    type: "string",
    message: "Consumer number must be a string",
  },
  documents: {
    required: false,
    type: "array",
    minLength: 1,
    maxLength: 14,
    message: "Documents must be an array with at least 1 and at most 14 files",
  },
};
