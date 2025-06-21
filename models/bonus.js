import mongoose from "mongoose";

const bonusSchema = new mongoose.Schema(
  {
    bonus_amount: {
      type: Number,
      required: true,
    },
    bonus_type: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    employee_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    threshold_amount: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Bonus = mongoose.model("Bonus", bonusSchema);
