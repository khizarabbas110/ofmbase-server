import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: true,
      trim: true,
    },
    rolePermissionModules: {
      type: [String],
      required: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// 💡 Enforce unique roleName per ownerId
roleSchema.index({ roleName: 1, ownerId: 1 }, { unique: true });

// Use existing model or create a new one
const RoleModel = models.role || model("role", roleSchema);

export default RoleModel;
