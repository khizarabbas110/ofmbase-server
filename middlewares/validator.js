// Utility function for field validation
export const validateField = (field, value, validationSchema) => {
  const rule = validationSchema[field];
  if (!rule) return null;

  // Normalize value to string if it's not null or undefined
  const isString = typeof value === "string";

  // Check for required fields
  if (rule.required && (!value || (isString && value.trim() === ""))) {
    return rule.message;
  }

  // Check for minimum length (only for string)
  if (rule.minLength && isString && value.length < rule.minLength) {
    return `${field} must be at least ${rule.minLength} characters long`;
  }

  // Check for email pattern
  if (rule.type === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isString || !emailPattern.test(value)) {
      return rule.message;
    }
  }

  // Check for number type
  if (rule.type === "number" && isNaN(value)) {
    return rule.message;
  }

  // Check for specific pattern
  if (rule.pattern && isString && !rule.pattern.test(value)) {
    return rule.message;
  }

  return null; // No errors
};

// Validator middleware function
export const validator =
  (validationSchemas, property = "body", place = "body") =>
  (req, res, next) => {
    const errors = [];
    const body = req[place];
    if (!body || typeof body !== "object") {
      return res
        .status(400)
        .json({ message: "Invalid request payload", success: false });
    }

    // Loop through the validation schemas
    validationSchemas.forEach((validationSchema) => {
      Object.keys(validationSchema).forEach((field) => {
        const error = validateField(field, body[field], validationSchema);
        if (error) {
          errors.push({ field, message: error });
        }
      });
    });

    if (errors.length === 0) {
      next(); // No validation errors, proceed to next middleware
    } else {
      res.status(400).json({
        message: "Validation failed",
        success: false,
        errors,
      });
    }
  };
const validateRequest = (data, schema, parentKey = "") => {
  const errors = [];

  for (const key in schema) {
    const field = schema[key];
    const value = data?.[key];
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      field.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push({
        field: fullKey,
        message: field.message || `${fullKey} is required.`,
      });
    }

    if (
      value !== undefined &&
      field.type &&
      typeof value !== typeofTypeMap(field.type)
    ) {
      errors.push({
        field: fullKey,
        message: `${field.message || fullKey} must be of type ${field.type}.`,
      });
    }

    if (field.schema && typeof value === "object") {
      const nestedErrors = validateRequest(value, field.schema, fullKey);
      errors.push(...nestedErrors);
    }
  }

  return errors;
};

// helper function to map schema type to JS typeof result
const typeofTypeMap = (type) => {
  switch (type) {
    case "email":
    case "string":
    case String:
      return "string";
    case "number":
    case Number:
      return "number";
    case "boolean":
    case Boolean:
      return "boolean";
    case "object":
    case Object:
      return "object";
    default:
      return typeof type;
  }
};

export const secondValidator = (validationSchema) => {
  return async (req, res, next) => {
    try {
      // Validate the request body using the custom validation function
      const errors = validateRequest(req.body, validationSchema);

      // If there are validation errors, send a response
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed. One or more fields are incorrect.",
          errors: errors, // Send back formatted validation errors
        });
      }

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      // If there's an error, check if it's a Mongoose validation error
      if (error.name === "ValidationError") {
        const mongooseErrors = Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message.replace(
            /Path `([^`]+)` is required\./,
            "$1 is required."
          ),
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed. One or more fields are incorrect.",
          errors: mongooseErrors,
        });
      }

      // If it's another type of error, return a generic error response
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred.",
        error: error.message,
      });
    }
  };
};
