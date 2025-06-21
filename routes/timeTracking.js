import express from "express";
const timeTrackingRouter = express.Router();
import authUser from "../middlewares/authUser.js";
import {
  creatingTimeTracking,
  deleteTimeTracking,
  getTimeTrackingByOwnerId,
  updateTimeTracking,
} from "../controllers/timeTracking.js";

timeTrackingRouter.post(
  "/create-time-tracking",
  authUser,
  creatingTimeTracking
);
timeTrackingRouter.get(
  "/fetch-time-tracking/:ownerId",
  authUser,
  getTimeTrackingByOwnerId
);
timeTrackingRouter.delete(
  "/delete-time-tracking/:id",
  authUser,
  deleteTimeTracking
);
timeTrackingRouter.patch(
  "/update-time-tracking/:id",
  authUser,
  updateTimeTracking
);

export default timeTrackingRouter;
