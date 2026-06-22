import { Router } from "express";
import * as newsController from "../controllers/news.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

const newsRouter = Router();

// 1. create News
newsRouter.post(
    "/create",
    authenticate,
    isAdmin,
    upload.single("image"),
    newsController.createNews,
);

// 2. get all news
newsRouter.get("/", newsController.getAllNews);

// 3. get news By Idb
newsRouter.get("/:id", newsController.getNewsById);

// 4. update news
newsRouter.patch(
    "/update/:id",
    authenticate,
    isAdmin,
    upload.single("image"),
    newsController.updateNews,
);

// 5. delete news
newsRouter.delete(
    "/delete/:id",
    authenticate,
    isAdmin,
    newsController.deleteNews,
);

export default newsRouter;
