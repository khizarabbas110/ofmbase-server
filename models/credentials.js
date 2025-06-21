import mongoose from "mongoose";

const { Schema, model } = mongoose;

const LoginCredentialSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
      required: false
    },
    creator_id: {
      type: Schema.Types.ObjectId,
      ref: "Creator",
      default: null,
      required: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CredentialsModal = model("CredentialsModal", LoginCredentialSchema);

export default CredentialsModal;
