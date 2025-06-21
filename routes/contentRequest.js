import express from "express";
const contentRequestRouter = express.Router();
import multer from "multer";
import authUser from "../middlewares/authUser.js";
const upload = multer(); // store in memory
import {
  createContentRequest,
  deleteContentOnlyNotRequest,
  deleteRequest,
  getRequests,
  getRequestsUnDetailed,
  updateRequest,
  uploadContentToRequest,
} from "../controllers/contentRequest.js";

contentRequestRouter.post(
  "/create-request",
  upload.array("file"),
  createContentRequest
);
contentRequestRouter.get("/get-requests/:id", authUser, getRequestsUnDetailed);
contentRequestRouter.get("/get-requests-detail/:id", authUser, getRequests);
contentRequestRouter.delete("/delete-request/:id", authUser, deleteRequest);
contentRequestRouter.delete(
  "/delete-content-request-only/:id",
  authUser,
  deleteContentOnlyNotRequest
);
contentRequestRouter.put(
  "/update-request/:id",
  authUser,
  // upload.array("file"),
  updateRequest
);

contentRequestRouter.post(
  "/upload-content",
  upload.array("file"),
  uploadContentToRequest
);

export default contentRequestRouter;
