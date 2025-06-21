import mongoose from "mongoose";

const financeEntrySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "creator earnings",
        "creator expense",
        "salary",
        "equipment",
        "software",
        "marketing",
        "other",
      ],
      required: true,
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Creator", depending on your user model
      required: false,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // if applicable
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "owner",
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const FinanceEntry = mongoose.model("FinanceEntry", financeEntrySchema);

export default FinanceEntry;
