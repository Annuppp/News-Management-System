import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

const categoryRouter = express.Router();

// 1. Create category
categoryRouter.post(
    "/create",
    authenticate,
    isAdmin,
    categoryController.createCategory,
);

// 2. Get all categories
categoryRouter.get("/getAll", categoryController.getAllCategory);

// 3. Get Single category
categoryRouter.get("/get/:id", categoryController.getCategoryById);

// 4. Update category
categoryRouter.patch(
    "/update/:id",
    authenticate,
    isAdmin,
    categoryController.updateCategory,
);

// 5. Delete category
categoryRouter.delete(
    "/delete/:id",
    authenticate,
    isAdmin,
    categoryController.deleteCategory,
);

export default categoryRouter;
