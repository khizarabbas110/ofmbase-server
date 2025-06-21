import express from "express";
import authUser from "../middlewares/authUser.js";
import { createReceipt, getReceiptsByOwnerId } from "../controllers/receipts.js";

const receiptRouter = express.Router();

receiptRouter.post("/create-receipts", authUser, createReceipt);
receiptRouter.get("/fetch-receipts/:id", getReceiptsByOwnerId);

export default receiptRouter;
