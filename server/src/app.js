import express from "express";
import morgan from "morgan";
import categoryRouter from "./routes/category.routes.js";
import newsRouter from "./routes/news.routes.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import commentRouter from "./routes/comment.route.js";

import cors from "cors";

const app = express();

// CORS configuration
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Allow specific origins
            const allowedOrigins = [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://localhost:3000",
            ];

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/uploads", express.static("src/uploads"));
app.use("/src/uploads", express.static("src/uploads"));

// routes
app.use("/category", categoryRouter);
app.use("/news", newsRouter);
app.use("/comment", commentRouter);
app.use("/user", authRouter);
app.use("/user", userRouter);
app.use("/user", commentRouter);

// Test route to see if routing works at all
app.get("/test-route", (req, res) => {
    res.json({ message: "Test route working" });
});

export default app;
