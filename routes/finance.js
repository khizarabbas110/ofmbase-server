import express from "express";
const financeRouter = express.Router();
import authUser from "../middlewares/authUser.js";
import {
  createFinanceEntry,
  deleteFinanceEntry,
  getFinanceEntriesByOwner,
  updateFinanceEntry,
} from "../controllers/finance.js";

financeRouter.post("/create-finance", authUser, createFinanceEntry);
financeRouter.get("/fetch-finance/:id", authUser, getFinanceEntriesByOwner);
financeRouter.patch("/update-finance/:id", authUser, updateFinanceEntry);
financeRouter.delete("/delete-finance/:id", authUser, deleteFinanceEntry);

export default financeRouter;
