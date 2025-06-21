import CoinbaseCommerce from "coinbase-commerce-node";
import PackageModal from "../models/subscriptions.js"; // adjust the path as needed
const { Client, resources } = CoinbaseCommerce;
const { Charge } = resources;

import PaymentModal from "../models/payments.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const createPayment = async (req, res) => {
  try {
    const { amount, date, description, employee_id, payment_method, ownerId } =
      req.body;

    // Create new payment instance
    const newPayment = new PaymentModal({
      amount,
      date,
      description,
      employee_id,
      payment_method,
      ownerId,
    });

    // Save to DB
    const savedPayment = await newPayment.save();

    res.status(201).json({
      message: "Payment recorded successfully",
      data: savedPayment,
    });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({
      message: "Failed to record payment",
      error: error.message,
    });
  }
};

export const getPaymentsByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({ message: "ownerid is required in params" });
    }

    const payments = await PaymentModal.find({ ownerId });
    if (!payments) {
      res.status(200).json({
        message: "Payments fetched successfully",
        data: [],
      });
    }
    res.status(200).json({
      message: "Payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

export const createCheckOutSession = async (req, res) => {
  const { planId, userId } = req.body;
  const plan = await PackageModal.findById(planId);

  if (!plan) {
    return res.status(400).json({ error: "Invalid plan ID" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // ⛳ Change these to your actual frontend URLs
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failure`,
      metadata: {
        userId,
        planId,
      },
    });

    return res.json({
      url: session.url,
      sessionId: session.id, // ✅ send sessionId to frontend
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const verifySession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const planId = session.metadata.planId; // ✅ KEEP AS STRING
    const userId = session.metadata.userId;

    const plan = await PackageModal.findById(planId); // ✅ use findById directly
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    return res.json({
      session,
      plan: { ...plan.toObject(), backEndId: planId }, // ✅ use .toObject() to safely spread mongoose doc
      userId,
    });
  } catch (err) {
    console.error("Error verifying session:", err);
    return res.status(500).json({ error: "Session verification failed" });
  }
};

//
Client.init(process.env.COINBASE_API_KEY);

export const createCoinbaseSession = async (req, res) => {
  const { planId, userId } = req.body;
  const plan = await PackageModal.findById(planId);

  if (!plan) {
    return res.status(400).json({ error: "Invalid plan ID" });
  }

  try {
    const response = await Charge.create({
      name: plan.name,
      description: `Subscription for ${plan.name}`,
      pricing_type: "fixed_price",
      local_price: {
        amount: plan.price.toString(),
        currency: "USD",
      },
      metadata: {
        userId,
        planId,
      },
      redirect_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failure`,
    });

    return res.json({
      url: response.hosted_url,
      chargeId: response.id, // Include this in response
    });
  } catch (err) {
    console.error("Coinbase session error:", err);
    return res
      .status(500)
      .json({ error: "Something went wrong with Coinbase" });
  }
};

export const verifyCoinbaseCharge = async (req, res) => {
  const { chargeId } = req.body;

  try {
    const charge = await Charge.retrieve(chargeId);
    const latestStatus = charge.timeline[charge.timeline.length - 1]?.status;

    if (latestStatus !== "COMPLETED") {
      return res
        .status(400)
        .json({ error: `Charge not completed. Status: ${latestStatus}` });
    }

    const planId = Number(charge.metadata.planId);
    const userId = charge.metadata.userId;
    const plan = await PackageModal.findById(planId); // Use findById to get the plan

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    return res.json({
      session: charge, // To match Stripe's session field (even if it's Coinbase's charge object)
      plan: { ...plan, backEndId: planId },
      userId,
    });
  } catch (err) {
    console.error("Error verifying Coinbase charge:", err);
    return res.status(500).json({ error: "Charge verification failed" });
  }
};
