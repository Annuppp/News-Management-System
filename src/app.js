import express from "express";
import morgan from "morgan";
import categoryRoutes from "./routes/category.routes.js";
import newsRouter from "./routes/news.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// route
app.use("/category", categoryRoutes);
app.use("/news", newsRouter);

export default app;
