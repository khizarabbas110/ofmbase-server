import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const contentRequestSchema = new Schema(
  {
    media_urls: {
      type: [String],
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: false,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "Creator",
      required: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    isContentRequest: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);

// Use existing model or create a new one
const sendContentModal =
  models.content || model("content", contentRequestSchema);

export default sendContentModal;
