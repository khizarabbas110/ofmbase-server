import express from "express";
import authUser from "../middlewares/authUser.js";
import { createInvoice, getInvoicesByOwner } from "../controllers/invoice.js";

const invoiceRouter = express.Router();

invoiceRouter.post("/create-invoice", authUser, createInvoice);
invoiceRouter.get("/fetch-invoices/:id", authUser, getInvoicesByOwner);

export default invoiceRouter;
