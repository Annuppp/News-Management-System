import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const authRouter = express.Router();

// Register User
authRouter.post(
    "/register",
    upload.single("image"),
    authController.registerUser,
);

// Login User
authRouter.post("/login", authController.login);

// Identifying the user from token
authRouter.get("/getMe", authController.getMe);

// Rotating tokens
authRouter.post("/rotateTokens", authController.rotateTokens);

// Logout route
authRouter.get("/logout", authController.logout);
authRouter.post("/logout", authController.logout);

// LogoutAll
authRouter.get("/logoutAll", authController.logoutAll);
authRouter.post("/logoutAll", authController.logoutAll);

// verify Email (supports both GET and POST)
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.post("/verify-email", authController.verifyEmail);

// Forgot password
authRouter.post("/forgot-password", authController.forgotPassword);

// Reset password
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
