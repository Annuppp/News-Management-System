import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

// Dashboard endpoint - requires authentication
userRouter.get("/dashboard", authenticate, userController.getDashboard);

export default userRouter;
