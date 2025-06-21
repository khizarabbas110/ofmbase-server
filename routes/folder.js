import express from "express";
const folderRouter = express.Router();
import authUser from "../middlewares/authUser.js";
import { createFolder, deleteFolder, getUserFolders } from "../controllers/folder.js";

folderRouter.post(
  "/create-folder",
  authUser,
  createFolder
);
folderRouter.get("/get-folder/:id", authUser, getUserFolders);
folderRouter.delete("/delete-folder/:id", authUser, deleteFolder);

export default folderRouter;
