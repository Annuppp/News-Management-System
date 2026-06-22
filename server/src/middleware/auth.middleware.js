import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model";

// checking if the user is logged in or not
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(404).json({
                message: "token not found",
            });
        }

        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

        const user = await userModel.findOne({
            _id: decoded.id,
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid access token",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

// checking admin
export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required",
            });
        }
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Access denied",
        });
    }
};
