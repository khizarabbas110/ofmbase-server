import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const addressSchema = new Schema({
  city: String,
  postalCode: String,
  state: String,
  street: String,
});

const measurementsSchema = new Schema({
  height: String,
  weight: String,
  dressSize: String,
  shoeSize: String,
  waist: String,
  hips: String,
});

const creatorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, default: "invited" },
    age: String,
    bio: String,
    country: String,
    address: addressSchema,
    measurements: measurementsSchema,
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const CreaterModal = models.creator || model("creator", creatorSchema);

export default CreaterModal;
