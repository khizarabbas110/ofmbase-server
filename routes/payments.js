// routes/paymentRoutes.js
import express from "express";
import {
  createCheckOutSession,
  createCoinbaseSession,
  createPayment,
  verifyCoinbaseCharge,
  verifySession,
} from "../controllers/payments.js";
import authUser from "../middlewares/authUser.js";
import { getPaymentsByOwnerId } from "../controllers/payments.js";

const paymentsRouter = express.Router();

paymentsRouter.post("/create-payments", authUser, createPayment);
paymentsRouter.get("/fetch-payments/:ownerId", authUser, getPaymentsByOwnerId);
paymentsRouter.post("/create-checkout-session", createCheckOutSession);
paymentsRouter.post("/create-coinbase-session", createCoinbaseSession);
paymentsRouter.post("/verify-session", verifySession);
paymentsRouter.post("/verify-coinbase-session", verifyCoinbaseCharge);

export default paymentsRouter;
