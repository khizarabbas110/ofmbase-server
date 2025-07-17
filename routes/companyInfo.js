import express from "express";
import {
  createCompanyInfo,
  getCompanyInfo,
  updateCompanyInfo,
} from "../controllers/companyInfo.js";
const companyInfoRouter = express.Router();

companyInfoRouter.post("/create-company-info", createCompanyInfo);

companyInfoRouter.get("/get-company-info/:ownerId", getCompanyInfo);

companyInfoRouter.put("/update-company-info/:ownerId", updateCompanyInfo);

export default companyInfoRouter;
