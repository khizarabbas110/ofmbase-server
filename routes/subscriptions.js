import express from "express";
import {
  createPackage,
  getAllPackages,
  togglePackageActiveStatus,
  updatePackage,
} from "../controllers/subscriptions.js";
const subscriptionsRouter = express.Router();

subscriptionsRouter.post("/add-new-subscriptions", createPackage);
subscriptionsRouter.get("/fetch-subscriptions", getAllPackages);
subscriptionsRouter.put(
  "/update-subscription-status/:id",
  togglePackageActiveStatus
);
subscriptionsRouter.put("/update-subscription/:id", updatePackage);

export default subscriptionsRouter;
