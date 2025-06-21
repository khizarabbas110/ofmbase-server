// models/DocumentTab.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: String,
  url: String,
  uploadDate: { type: Date, default: Date.now },
  type: String, // ✅ add this if not present
});

const folderSchema = new mongoose.Schema({
  name: String,
  documents: [documentSchema],
});

const documentTabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folders: [folderSchema],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("DocumentTab", documentTabSchema);
