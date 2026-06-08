import { Router } from "express";
import * as newsController from "../controllers/news.controller.js";

const newsRouter = Router();

// 1. create News
newsRouter.post("/create", newsController.createNews);

// 2. get all news
newsRouter.get("/", newsController.getAllNews);

// 3. get news By Idb 
newsRouter.get("/:id", newsController.getNewsById);

// 4. update news
newsRouter.patch("/update/:id", newsController.updateNews);

// 5. delete news
newsRouter.delete("/delete/:id", newsController.deleteNews);

export default newsRouter;
