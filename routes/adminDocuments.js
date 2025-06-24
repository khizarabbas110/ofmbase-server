import express from "express";
import { createAdminDocuments, getUserDocument, updateUserDocument } from "../controllers/adminDocuments.js";

const adminDocumentRouter = express.Router();

adminDocumentRouter.post('/create-documents', createAdminDocuments); // Create empty record
adminDocumentRouter.get("/fetch-documents", getUserDocument); // GET  /api/user-documents
adminDocumentRouter.put("/update-documents", updateUserDocument); 


export default adminDocumentRouter;
