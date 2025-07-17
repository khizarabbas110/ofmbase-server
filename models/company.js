import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const companyInfoSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    vatNumber: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    accountName: {
      type: String,
      required: false,
    },
    accountNumber: {
      type: String,
      required: false,
    },
    routingNumber: {
      type: String,
      required: false,
    },
    swiftCode: {
      type: String,
      required: false,
    },
    paypalEmail: {
      type: String,
      required: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const companyInfoModal =
  models.companyInfo || model("companyInfo", companyInfoSchema);

export default companyInfoModal;
