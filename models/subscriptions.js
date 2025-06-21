import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    creators: {
      type: Number,
      required: true,
    },
    employees: {
      type: Number,
      required: true,
    },
    storage: {
      type: Number,
      required: true, // in GB
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const subscriptionsModal = mongoose.model("Package", PackageSchema);

export default subscriptionsModal;
