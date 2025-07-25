import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        amount: { type: Number, required: true }, // You can calculate this or store it
      },
    ],
    notes: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "card", "cash"], // Add more methods if needed
      required: true,
    },
    bankInfo: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      routingNumber: String,
      swiftCode: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerContact: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
