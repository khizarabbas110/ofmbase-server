import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import packageModal from "../models/subscriptions.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/transporter.js"; // Import the transporter from your email config
import TokenModel from "../models/Token.js";
import crypto from "crypto";
import CreaterModal from "../models/creator.js";
import employeeModel from "../models/employee.js";
import RoleModel from "../models/role.js";
//
import Stripe from "stripe";
import { resetPasswordEmailTemplaet } from "../utils/emailTemplates.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Make sure this key is defined in your .env

dotenv.config(); // Load environment variables
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
export const registerUser = async (req, res) => {
  try {
    const { email, password, method } = req.body;

    // 1) Check if there’s a verified user already
    const existing = await userModel.findOne({ email }).lean();
    if (existing?.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 2) Either reuse the unverified user or create a fresh one
    const user = existing
      ? existing
      : await userModel.create({
          email,
          password: await bcrypt.hash(password, 10),
          method,
          isVerified: false,
          ownerId: "Agency Owner itself",
        });

    // 3) Generate & store a single-use token (overwriting any old one)
    const tokenString = crypto.randomBytes(32).toString("hex");
    await TokenModel.findOneAndUpdate(
      { userId: user._id },
      {
        token: tokenString,
        expiresAt: Date.now() + 3600_000, // 1h
      },
      { upsert: true, new: true }
    );

    // 4) Build the verification email once
    const link = `${process.env.CLIENT_URL}/verify-email/${tokenString}`;
    const html = buildVerificationEmail(link);

    // 5) Kick off the email send but don’t await it
    await sendVerificationEmail(email, html, "Verify Your Email");

    // 6) Respond immediately
    res.status(200).json({
      success: true,
      message: existing
        ? "Verification email resent. Please check your inbox."
        : "Registration successful. Please check your email to verify.",
    });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Helpers

/**
 * Returns an email body for a verification link.
 */
function buildVerificationEmail(verificationLink) {
  const year = new Date().getFullYear();
  return `
  <div style="max-width:600px;margin:auto;padding:20px;font-family:Arial,sans-serif;text-align:center;
              border:1px solid #ddd;border-radius:10px;">
    <h2 style="color:#333;">Verify Your Email</h2>
    <p style="font-size:16px;color:#555;">
      Thanks for signing up! Click below to verify your email address:
    </p>
    <a href="${verificationLink}"
       style="display:inline-block;padding:12px 24px;margin-top:10px;
              font-size:16px;color:#fff;background:#4CAF50;text-decoration:none;border-radius:5px;">
      Verify Email
    </a>
    <p style="font-size:14px;color:#777;margin-top:20px;">
      If you didn’t request this, just ignore this email.
    </p>
    <hr style="margin:20px 0;">
    <p style="font-size:12px;color:#999;">&copy; ${year} Your Company. All rights reserved.</p>
  </div>
  `;
}
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration
//User Registration

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // Check if the user has a password (for custom login method)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Try logging in with Google.",
      });
    }
    let accessibleModules;
    if (user.accountType === "employee") {
      const currentEmployee = await employeeModel.findOne({
        email: user.email,
      });
      const currentEmployeeRole = await RoleModel.findOne({
        roleName: currentEmployee.role,
      });
      const tempVar = currentEmployeeRole.rolePermissionModules;
      accessibleModules = [...tempVar, "settings"];
      if (currentEmployeeRole.rolePermissionModules.length === 0) {
        return res.status(401).json({
          success: false,
          message: "You don't have permission to access this account.",
        });
      }
    }
    if (user.accountType === "creator") {
      accessibleModules = ["dashboard", "library", "costumes", "settings"];
    }
    if (user.accountType === "owner") {
      accessibleModules = [
        "dashboard",
        "library",
        "costumes",
        "marketing",
        "tasks",
        "creators",
        "employees",
        "financials",
        "credentials",
        "settings",
        "documents",
        "timetracking",
        "payments",
        "bonuses",
        "receipts",
        "invoices",
      ];
    }

    // Validate the provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create JWT payload with user details
    const payload = { id: user._id, email: user.email };

    // Sign JWT token
    // Sign JWT token with 24h expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h", // Token will expire after 24 hours
    });

    if (user.accountType === "employee") {
      const result = await employeeModel.updateOne(
        { email: user.email },
        { $set: { status: "active" } }
      );

      if (result.modifiedCount > 0) {
      } else {
        console.log("No employee updated.");
      }
    }
    if (user.accountType === "creator") {
      const result = await CreaterModal.updateOne(
        { email: user.email },
        { $set: { status: "active" } }
      );

      if (result.modifiedCount > 0) {
      } else {
        console.log("No employee updated.");
      }
    }

    // Return success message with token
    return res.status(200).json({
      success: true,
      message: "User login successful.",
      user: {
        id: user._id,
        email: user.email,
        method: user.method,
        token,
        accountType: user.accountType,
        ownerId: user.ownerId,
        fullName: user.fullName,
        status: user.status,
        accessibleModules: accessibleModules,
        subscribedPackage: user.subscribedPackage,
        subscriptionStart: user.subscriptionStart,
        subscriptionExpiry: user.subscriptionExpiry,
      },
      impression: user.impression, // Include impression in response
    });
  } catch (error) {
    console.log("Error in loginUser:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Transporter for sending emails

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate Reset Token (valid for 1 hour)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {});

    // Save token in the database
    await TokenModel.create({
      userId: user._id,
      token,
      expiresAt: Date.now() + 3600000, // 1 hour expiry
    });

    // Reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    //df
    // 4) Build the verification email once
    const html = resetPasswordEmailTemplaet(resetLink);

    // 5) Kick off the email send but don’t await it
    await sendVerificationEmail(user.email, html, "Reset Your Password");

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Reset Password API

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== "string") {
      return res
        .status(400)
        .json({ message: "New password is required and must be a string" });
    }

    // Find token in the database
    const tokenEntry = await TokenModel.findOne({ token });
    if (!tokenEntry) {
      return res.status(400).json({
        message: "Invalid or expired session. Please request a new one.",
      });
    }

    // Check if the token has expired
    if (Date.now() > tokenEntry.expiresAt) {
      await TokenModel.deleteOne({ token }); // Remove expired token
      return res
        .status(401)
        .json({ message: "Token has expired. Please request a new one." });
    }

    // Find user by ID from token entry
    const user = await userModel.findById(tokenEntry.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    user.password = hashedPassword;
    await user.save();

    // Invalidate the token after successful password reset
    await TokenModel.deleteOne({ token });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find token in the database
    const tokenEntry = await TokenModel.findOne({ token });
    if (!tokenEntry) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user and update verification status
    const user = await userModel.findById(tokenEntry.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    // Delete token after verification
    await TokenModel.deleteOne({ token });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName } = req.body;

    // Validate input
    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    // Find user by ID and update fullName
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { fullName },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const accountType = updatedUser.accountType;
    const ownerId = updatedUser.ownerId;
    if (accountType === "owner") {
    } else if (accountType === "employee") {
      const employeeNew = await employeeModel.findOne({ ownerId });
      employeeNew.name = fullName;
      await employeeNew.save();
    } else if (accountType === "creator") {
      const creatorNew = await CreaterModal.findOne({ ownerId });
      creatorNew.name = fullName;
      await creatorNew.save();
    }
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const fetchUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ fullName: user.fullName });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const paymentStripe = async (req, res) => {
  const { items } = req.body;

  try {
    // 1. Get the product ID
    const itemId = items[0]?.backEndId;
    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "No product ID provided." });
    }

    // 2. Lookup product
    const product = await packageModal.findById(itemId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID." });
    }

    // 3. Convert price to cents (Stripe uses the smallest currency unit)
    const amount = product.price * 100;

    // If Free Plan, skip Stripe
    if (amount === 0) {
      return res.status(200).json({
        success: true,
        message: "Free plan selected. No payment needed.",
        clientSecret: null,
      });
    }

    // 4. Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      description: `Purchase of ${product.name} plan`,
      metadata: {
        productName: product.name,
        productId: itemId,
      },
    });

    // 5. Respond with clientSecret
    res.status(200).json({
      success: true,
      message: "PaymentIntent created",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    // 1. Get the product ID
    const { backEndId, userId, subscriptionStart, subscriptionExpiry } =
      req.body;
    const selectedItem = await packageModal.findOne({ _id: backEndId });
    if (!selectedItem) {
      return res.status(400).json({
        success: false,
        message: "Selected package not found.",
      });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          subscribedPackage: selectedItem.name,
          subscriptionStart: new Date(subscriptionStart), // convert to Date
          subscriptionExpiry: new Date(subscriptionExpiry), // convert to Date
        },
      },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: `${selectedItem.price} received successfully`,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        method: updatedUser.method,
        accountType: updatedUser.accountType,
        ownerId: updatedUser.ownerId,
        fullName: updatedUser.fullName,
        subscribedPackage: updatedUser.subscribedPackage,
        subscriptionStart: updatedUser.subscriptionStart,
        subscriptionExpiry: updatedUser.subscriptionExpiry,
      },
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const checkTokenExpiry = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required.",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      success: true,
      message: "Token is valid.",
      user: {
        id: decoded.id,
        email: decoded.email,
      },
      expiresAt: new Date(decoded.exp * 1000),
    });
  } catch (error) {
    const isExpired = error.name === "TokenExpiredError";

    return res.status(401).json({
      success: false,
      message: isExpired ? "Token has expired." : "Invalid token.",
      expired: isExpired,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    const existingCreator = await CreaterModal.findOneAndDelete({
      email: user.email,
    });
    const existingEmployee = await employeeModel.findOneAndDelete({
      email: user.email,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!existingCreator && !existingEmployee) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
