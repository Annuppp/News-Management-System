import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const authRouter = Router();

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

// LogoutAll
authRouter.get("/logoutAll", authController.logoutAll);

//verify Email
authRouter.get("/verify-email", authController.verifyEmail);

export default authRouter;
