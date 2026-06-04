import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";

const categoryRoutes = Router();

// 1. Create category
categoryRoutes.post("/create", categoryController.createCategory);

// 2. Get all categories
categoryRoutes.get("/getAll", categoryController.getAllCategory);

// 3. Get Single category
categoryRoutes.get("/get/:id", categoryController.getCategoryById);

// 4. Update category
categoryRoutes.patch("/update/:id", categoryController.updateCategory);

// 5. Delete category
categoryRoutes.delete("/delete/:id", categoryController.deleteCategory);

export default categoryRoutes;
