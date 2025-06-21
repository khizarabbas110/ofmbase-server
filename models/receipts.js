import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    // Adjust fields as needed based on the actual structure of an item
    name: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  items: {
    type: [ItemSchema],
    default: [],
    required: false,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank_transfer", "credit_card", "paypal"],
    required: true,
  },
  cash: {
    receivedFrom: {
      type: String,
      default: "",
      required: false,
    },
  },
  bankTransfer: {
    confirmationNumber: {
      type: String,
      default: "",
      required: false,
    },
  },
  creditCard: {
    last4: {
      type: String,
      default: "",
      required: false,
    },
    brand: {
      type: String,
      default: "",
      required: false,
    },
  },
  paypal: {
    transactionId: {
      type: String,
      default: "",
      required: false,
    },
  },
  notes: {
    type: String,
    default: "",
    required: false,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Update this to the correct model if needed
  },
  amount: {
    type: Number,
    required: false,
    default: 0, // defined modulelarly
  },
});

export default mongoose.models.Receipts ||
  mongoose.model("Receipts", InvoiceSchema);
