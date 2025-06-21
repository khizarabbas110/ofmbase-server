import User from "../models/user.js";
import bcrypt from "bcrypt";
import TokenModel from "../models/Token.js";
import userModel from "../models/user.js";
import crypto from "crypto";
import { buildVerificationEmail, transporter } from "../utils/admin.js";


export const fetchAllUsers = async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (ownerId === "0") {
      return res.status(200).json({
        success: true,
        users: [],
        message: "No users found for ownerId 0.",
      });
    }

    const users = await User.find({ ownerId: "Agency Owner itself" });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users.",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user.",
    });
  }
}


export const addUserByAdmin = async (req, res) => {
  try {
    const { email, name, password } = req.body;

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
          method: "custom",
          isVerified: true,
          fullName: name,
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
    const html = buildVerificationEmail(name, email, password);

    // 5) Kick off the email send but don’t await it
    transporter
      .sendMail({
        from: `"ofmbase" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email",
        html,
      })
      .catch((err) => {
        console.error("Failed to send verification email:", err);
      });

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