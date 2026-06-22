import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

const categoryRoutes = Router();

// 1. Create category
categoryRoutes.post(
    "/create",
    authenticate,
    isAdmin,
    categoryController.createCategory,
);

// 2. Get all categories
categoryRoutes.get("/getAll", categoryController.getAllCategory);

// 3. Get Single category
categoryRoutes.get("/get/:id", categoryController.getCategoryById);

// 4. Update category
categoryRoutes.patch(
    "/update/:id",
    authenticate,
    isAdmin,
    categoryController.updateCategory,
);

// 5. Delete category
categoryRoutes.delete(
    "/delete/:id",
    authenticate,
    isAdmin,
    categoryController.deleteCategory,
);

export default categoryRoutes;
