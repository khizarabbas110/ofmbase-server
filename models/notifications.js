import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const notificationSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    forId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "content-request",
        "tasks",
        "content-request-detail",
        "content-request-uploaded",
      ],
      required: false,
    },
    moduleName: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Use existing model or create a new one
const notificationModal =
  models.notifications || model("notification", notificationSchema);

export default notificationModal;
