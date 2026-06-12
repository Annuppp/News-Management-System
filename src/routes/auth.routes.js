import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

// Register User
authRouter.post("/register", authController.registerUser);

// Identifying the user from token
authRouter.get("/getMe", authController.getMe);

// Rotating tokens
authRouter.post("/rotateTokens", authController.rotateTokens);

// Logout route
authRouter.get("/logout", authController.logout);

// LogoutAll
authRouter.get("logoutAll", authController.logoutAll);

export default authRouter;
