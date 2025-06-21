// routes/documentRoutes.js
import express from "express";
import {
  createTab,
  addFolder,
  uploadDocument,
  getTabs,
  deleteDocument,
} from "../../controllers/documents/tabs.js";
import multer from "multer";
const upload = multer(); // store in memory
const documentTabRouter = express.Router();

documentTabRouter.post("/tabs/create-document-tab", createTab);
documentTabRouter.get("/tabs/:ownerId", getTabs);
documentTabRouter.post("/tabs/:tabId/folders", addFolder);
documentTabRouter.post(
  "/:tabId/folders/:folderId/upload",
  upload.array("file"),
  uploadDocument
);
documentTabRouter.delete("/delete-document/:documentId", deleteDocument);



export default documentTabRouter;
