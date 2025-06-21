import mongoose from "mongoose";

const creatorSaleSchema = new mongoose.Schema({
  creator_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const timeTrackingSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Employee" if you have a separate employee model
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: String, // or `Date` if you want real date handling
      required: true,
    },
    hours: {
      type: Number,
      required: true,
    },
    creator_sales: {
      type: [creatorSaleSchema], // an array of objects
      default: [],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
  },
  { timestamps: true }
);

const TimeTrackingModal = mongoose.model(
  "TimeTrackingModal",
  timeTrackingSchema
);
export default TimeTrackingModal;
