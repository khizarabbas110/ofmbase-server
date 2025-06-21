import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    assigned_to: { type: String, required: true }, // consider ObjectId if appropriate
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
      get: (date) => date.toISOString().split("T")[0], // Optional: format on retrieval
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const TaskModel = models.Task || model("Task", taskSchema);
export default TaskModel;
