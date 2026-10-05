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
            // Allow requests with no origin (like mobile apps, curl, Postman)
            if (!origin) return callback(null, true);

            // Allow any localhost / 127.0.0.1 port (5173, 5174, etc.)
            if (
                /^http:\/\/localhost(:\d+)?$/.test(origin) ||
                /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
            ) {
                return callback(null, true);
            }

            callback(new Error("Not allowed by CORS"));
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
