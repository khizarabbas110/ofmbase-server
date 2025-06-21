import express from "express";
const contentRouter = express.Router();
import multer from "multer";
const upload = multer(); // store in memory
import {
  CreateAndUploadContent,
  deleteContent,
  getCreatorContent,
} from "../controllers/content.js";

contentRouter.post(
  "/send-request",
  upload.array("file"),
  CreateAndUploadContent
);
contentRouter.get("/get-content/:ownerId", getCreatorContent);
contentRouter.delete("/delete-content/:id", deleteContent)

export default contentRouter;
