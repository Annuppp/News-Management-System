import express from "express";
import morgan from "morgan";
import categoryRouter from "./routes/category.routes.js";
import newsRouter from "./routes/news.routes.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";

const app = express();

// CORS configuration
app.use(
    cors({
        origin: ["http://localhost:5174", "http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

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
app.use("/user", userRouter);

export default app;
