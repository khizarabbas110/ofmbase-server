import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const contentRequestSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    constumeNumber: {
      type: String,
      required: false,
    },
    paymentAmount: {
      type: Number,
      required: false,
    },
    videoType: {
      type: String,
      required: false,
    },
    videoLength: {
      type: String,
      required: false,
    },
    subRequest: {
      type: String,
      required: false,
    },
    outFitDescription: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    due_date: {
      type: Date,
      required: false,
    },
    media_urls: {
      type: [String],
      required: false,
    },
    creatorName: {
      type: String,
      required: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "done", "rejected"],
      default: "pending",
      required: false,
    },
    //
    //
    //
    content_urls: {
      type: [String],
      required: false,
    },
    fileName: {
      type: String,
      required: false,
    },
    contentType: {
      type: String,
      required: false,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: false,
    },
    folderName: {
      type: String,
      required: false,
    },
    isContentRequest: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  { timestamps: true }
);

// Use existing model or create a new one
const contentRequestModal =
  models.contentRequestModal || model("ContentRequest", contentRequestSchema);

export default contentRequestModal;
