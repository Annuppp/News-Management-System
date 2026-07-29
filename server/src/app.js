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
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Allow specific origins
            if (
                origin === "http://localhost:5174" ||
                origin === "http://localhost:5173"
            ) {
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

// route
app.use("/category", categoryRouter);
app.use("/news", newsRouter);
app.use("/user", authRouter);
app.use("/user", userRouter);

// Test route to see if routing works at all
app.get("/test-route", (req, res) => {
    res.json({ message: "Test route working" });
});

export default app;
