import express from "express";
import morgan from "morgan";
import categoryRouter from "./routes/category.routes.js";
import newsRouter from "./routes/news.routes.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/uploads", express.static("src/uploads"));

// route
app.use("/category", categoryRouter);
app.use("/news", newsRouter);
app.use("/user", authRouter);

export default app;
