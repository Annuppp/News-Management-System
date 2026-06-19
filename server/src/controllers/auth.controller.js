import userModel from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sessionModel from "../models/session.model.js";
import crypto from "crypto";
import { ref } from "process";

export const registerUser = async (req, res) => {
    try {
        // getting all the fields from the client
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Every field is required",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!hashedPassword) {
            return res.status(400).json({
                message: "Error hashing the password",
            });
        }

        const user = await userModel.create({
            ...req.body,
            password: hashedPassword,
        });

        if (!user) {
            return res.status(400).json({
                message: "Error creating a user",
            });
        }

        // creating a refresh token

        const refreshToken = jwt.sign(
            {
                id: user._id,
            },
            config.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d",
            },
        );

        // storing the refresh token inside the cookie

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        // creating the access token

        const accessToken = jwt.sign(
            {
                id: user._id,
                sessionId: session._id,
            },
            config.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            },
        );

        res.status(201).json({
            message: "User has been created",
            user: {
                username: user.username,
                email: user.email,
            },
            accessToken,
        });
    } catch (err) {
        res.status(400).json({
            message: "Error registering the user",
            error: err.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("login attempt for email", email);

        const user = await userModel.findOne({
            email,
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        console.log("USER FOUND:", user.email);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("PASSWORD MATCH:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const refreshToken = jwt.sign(
            {
                id: user._id,
            },
            config.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d",
            },
        );

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        const accessToken = jwt.sign(
            {
                id: user._id,
                sessionId: session._id,
            },
            config.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            },
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Logged in successfully",
            user: {
                username: user.username,
                email: user.email,
            },
            accessToken,
        });
    } catch (err) {
        res.status(404).json({
            message: "Error logging in the user",
            error: err.message,
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            return res.status(404).json({
                message: "access token not found",
            });
        }

        const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid access token",
            });
        }

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "No user found",
            });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "Error getting the user",
            error: err.message,
        });
    }
};

export const rotateTokens = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(404).json({
                message: "refreshToken not found",
            });
        }

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid refreshToken",
            });
        }

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false,
        });

        if (!session) {
            return res.status(404).json({
                message: "Unable to find the session",
            });
        }

        // creating the accessToken
        const accessToken = jwt.sign(
            {
                id: user._id,
                sessionId: session._id,
            },
            config.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            },
        );

        // creating the refreshToken for extra security
        const newRefreshToken = jwt.sign(
            {
                id: user._id,
            },
            config.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d",
            },
        );

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const newRefreshTokenHash = crypto
            .createHash("sha256")
            .update(newRefreshToken)
            .digest("hex");

        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        res.status(200).json({
            message: "Rotated tokens successfully",
            user: {
                username: user.username,
                email: user.email,
            },
            accessToken,
        });
    } catch (err) {
        res.status(400).json({
            message: "Error rotating the tokens",
            error: err.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(404).json({
                message: "RefreshToken not found",
            });
        }

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false,
        });

        if (!session) {
            return res.status(401).json({
                message: "Invalid refreshToken",
            });
        }

        session.revoked = true;
        await session.save();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (err) {
        res.status(400).json({
            message: " Error logging out the user",
            error: err.message,
        });
    }
};

export const logoutAll = async (req, res) => {
    try {
        const refreshToken = res.cookie.refreshToken;

        if (!refreshToken) {
            return res.status(404).json({
                message: "RefreshToken not found",
            });
        }

        const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

        const session = await sessionModel.updateMany(
            {
                id: decoded.id,
                revoked: false,
            },
            {
                revoked: true,
            },
        );

        res.clearCookie(refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.status(200).json({
            message: "Logged out from all the devices successfully",
        });
    } catch (err) {
        res.status(404).json({
            message: "Error logging all the users",
            error: err.message,
        });
    }
};
