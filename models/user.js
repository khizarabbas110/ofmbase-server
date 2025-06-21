import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: false,
      default: "",
    },
    email: {
      type: String,
      required: true, // Only email is required
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Email validation regex
    },
    password: {
      type: String, // Optional
      required: true,
    },
    isVerified: {
      type: Boolean, // Optional
      default: false, // Default value is false
    },
    accountType: {
      type: String, // Optional
      enum: ["owner", "creator", "employee"], // Only admin or user is allowed
      default: "owner", // Default value is user
    },
    method: {
      type: String, // Optional
      required: true,
      enum: ["custom", "gmail"],
      default: "custom", // Default value is "custom"
    },
    subscribedPackage: {
      type: String,
      default: "Free",
      required: false, // It is optional now
      enum: ["Free", "Starter", "Professional", "Enterprise"], // Only these values are allowed
    },
    ownerId: {
      type: Schema.Types.Mixed, // Allows both ObjectId and String
      required: false,
    },
    subscriptionStart: {
      type: Date,
      required: false,
    },
    subscriptionExpiry: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// Use existing model or create a new one
const userModel = models.user || model("user", userSchema);

export default userModel;
