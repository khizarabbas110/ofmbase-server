import express from "express";
import { validator } from "../middlewares/validator.js";
import {
  loginAdminValidation,
  registerUserValidation,
} from "../config/validation.js";
import {
  checkTokenExpiry,
  confirmPayment,
  deleteUser,
  fetchUserProfile,
  loginUser,
  paymentStripe,
  registerUser,
  updateProfile,
  verifyEmail,
} from "../controllers/user.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", validator([registerUserValidation]), registerUser);
userRouter.post("/login", validator([loginAdminValidation]), loginUser);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post("/update-profil/:id", updateProfile);
userRouter.get("/fetch-profile/:id", fetchUserProfile);
// Forgot & Reset Password Routes
// userRouter.post(
//   "/forgot-password",
//   validator([forgotPasswordValidation]),
//   forgotPassword
// );
userRouter.post("/payment-stripe", authUser, paymentStripe);
userRouter.post("/payment-confirm", authUser, confirmPayment);
userRouter.post("/confirm-token", authUser, checkTokenExpiry);
userRouter.delete("/delete-user-permanently/:id", authUser, deleteUser);

export default userRouter;
