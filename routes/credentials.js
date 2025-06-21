import express from "express";
import {
  createLoginCredential,
  deleteCredential,
  getLoginCredentialsByOwner,
  updateLoginCredential,
} from "../controllers/credentials.js";

const credentialsRouter = express.Router();

credentialsRouter.post("/create-credentials", createLoginCredential);
credentialsRouter.get(
  "/fetch-credentials/:ownerId",
  getLoginCredentialsByOwner
);
credentialsRouter.put("/update-credentials/:id", updateLoginCredential);
credentialsRouter.delete("/delete-credentials/:id", deleteCredential);

export default credentialsRouter;
