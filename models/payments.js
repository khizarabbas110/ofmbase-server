// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    employee_id: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["paypal", "bank_transfer", "cash", "check"],
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Update this to the correct model if needed
    },
  },
  {
    timestamps: true,
  }
);

// Use the existing model if it exists to avoid overwrite errors during hot reload
const PaymentModal =
  mongoose.models.PaymentModal || mongoose.model("PaymentModal", paymentSchema);

export default PaymentModal;
