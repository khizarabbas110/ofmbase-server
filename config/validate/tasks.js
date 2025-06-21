export const createTaskValidation = {
  title: {
    required: true,
    type: String,
    message: "Task title is required",
  },
  description: {
    required: true,
    type: String,
    message: "Task description is required",
  },
  priority: {
    required: true,
    type: String,
    enum: ["low", "medium", "high"],
    message: "Priority must be one of: low, medium, or high",
  },
  assigned_to: {
    required: true,
    type: String,
    message: "Assigned employee name or ID is required",
  },
  employeeId: {
    required: true,
    type: "ObjectId", // you can keep as String if not validating ObjectId specifically
    message: "Valid employee ID is required",
  },
  due_date: {
    required: true,
    type: "Date",
    message: "Due date is required",
    validate: (value) => {
      const isValidDate = !isNaN(Date.parse(value));
      return (
        isValidDate || "Due date must be a valid date in YYYY-MM-DD format"
      );
    },
  },
  status: {
    required: true,
    type: String,
    enum: ["pending", "in-progress", "completed"],
    message: "Status must be one of: pending, in-progress, or completed",
  },
  ownerId: {
    required: false,
    type: "ObjectId",
    message: "Owner ID must be a valid user reference",
  },
};
