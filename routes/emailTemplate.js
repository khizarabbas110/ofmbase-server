import express from "express";
import {
  createEmailTemplate,
  getAllEmailTemplates,
} from "../controllers/emailTemplate.js";
const emailTemplateRouter = express.Router();

emailTemplateRouter.post("/create-templates", createEmailTemplate);
emailTemplateRouter.get("/fetch-templates", getAllEmailTemplates);

export default emailTemplateRouter;
