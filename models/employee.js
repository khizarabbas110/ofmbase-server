import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "invited"],
      default: "invited",
    },
    hourly_rate: {
      type: String, // You can change this to Number if needed
      required: false,
    },
    payment_method: {
      type: String,
      enum: ["paypal", "bank_transfer", "crypto"],
      required: true,
    },
    paypal_email: {
      type: String,
      required: function () {
        return this.payment_method === "paypal";
      },
    },
    payment_schedule: {
      type: String,
      enum: ["weekly", "biweekly", "monthly"],
      required: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const employeeModel = models.employee || model("employee", employeeSchema);

export default employeeModel;
