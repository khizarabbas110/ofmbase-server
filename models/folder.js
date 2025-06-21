import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
const folderModel = models.folder || model("folder", folderSchema);

export default folderModel;
