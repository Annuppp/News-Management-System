import express from "express";
import * as commentController from "../controllers/comment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const commentRouter = express.Router();

commentRouter.post("/", authenticate, commentController.createComment);
commentRouter.post("/create", authenticate, commentController.createComment);
commentRouter.get("/:newsId", commentController.getCommentsByNews);

export default commentRouter;
