import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

// Register User
authRouter.post("/register", authController.registerUser);

// Identifying the user from token
authRouter.get("/getMe", authController.getMe);

// Rotating tokens
authRouter.post("/rotateTokens", authController.rotateTokens);

export default authRouter;
