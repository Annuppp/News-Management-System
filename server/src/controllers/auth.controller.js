import userModel from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sessionModel from "../models/session.model.js";
import crypto from "crypto";
import { sendEmail } from "../services/email.service.js";
import { generateOTP, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const image = req.file?.path;

        if (!username || !email || !password || !image) {
            return res.status(400).json({
                message: "Every field is required (username, email, password, and profile image)",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!hashedPassword) {
            return res.status(400).json({
                message: "Error hashing the password",
            });
        }

        const user = await userModel.create({
            username: username.trim(),
            email: normalizedEmail,
            image,
            password: hashedPassword,
            role: "user",
            verified: true, // Auto-verified when OTP flow is optional/bypassed
        });

        if (!user) {
            return res.status(400).json({
                message: "Error creating a user",
            });
        }

        res.status(201).json({
            message: "User has been created",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                verified: user.verified,
            },
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
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const refreshTokenExpiry = rememberMe ? "30d" : "7d";

        const refreshToken = jwt.sign(
            {
                id: user._id,
            },
            config.REFRESH_TOKEN_SECRET,
            {
                expiresIn: refreshTokenExpiry,
            },
        );

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip || "127.0.0.1",
            userAgent: req.headers["user-agent"] || "unknown",
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

        const cookieMaxAge = rememberMe
            ? 30 * 24 * 60 * 60 * 1000
            : 7 * 24 * 60 * 60 * 1000;

        const isProd = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "strict" : "lax",
            maxAge: cookieMaxAge,
        });

        res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error logging in",
            error: err.message,
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            return res.status(401).json({
                message: "Access token not found",
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
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(401).json({
            message: "Error getting the user or token expired",
            error: err.message,
        });
    }
};

export const rotateTokens = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "refreshToken not found",
            });
        }

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
        } catch (jwtErr) {
            return res.status(401).json({
                message: "Invalid or expired refreshToken",
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
            return res.status(401).json({
                message: "Session expired or revoked",
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

        // creating the new refreshToken for rotation
        const newRefreshToken = jwt.sign(
            {
                id: user._id,
            },
            config.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d",
            },
        );

        const isProd = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "strict" : "lax",
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
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken: newRefreshToken,
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
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (refreshToken) {
            const refreshTokenHash = crypto
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");

            const session = await sessionModel.findOne({
                refreshTokenHash,
                revoked: false,
            });

            if (session) {
                session.revoked = true;
                await session.save();
            }
        }

        const isProd = process.env.NODE_ENV === "production";
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "strict" : "lax",
        });

        res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (err) {
        res.status(400).json({
            message: "Error logging out the user",
            error: err.message,
        });
    }
};

export const logoutAll = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                message: "RefreshToken not found",
            });
        }

        const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

        await sessionModel.updateMany(
            {
                user: decoded.id,
                revoked: false,
            },
            {
                revoked: true,
            },
        );

        const isProd = process.env.NODE_ENV === "production";
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "strict" : "lax",
        });

        res.status(200).json({
            message: "Logged out from all the devices successfully",
        });
    } catch (err) {
        res.status(400).json({
            message: "Error logging out all devices",
            error: err.message,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const otp = req.body?.otp || req.query?.otp;
        const email = req.body?.email || req.query?.email;

        if (!otp || !email) {
            return res.status(400).json({
                message: "OTP and email are required",
            });
        }

        const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");

        const otpDoc = await otpModel.findOne({
            email: email.toLowerCase().trim(),
            otpHash,
        });

        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
            });
        }

        const user = await userModel.findByIdAndUpdate(
            otpDoc.user,
            { verified: true },
            { new: true },
        );

        await otpModel.deleteMany({
            user: otpDoc.user,
        });

        return res.status(200).json({
            message: "Email verified successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "Error verifying the email",
            error: err.message,
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found with this email",
            });
        }

        const otp = generateOTP();

        const html = getOtpHtml(otp);

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        await otpModel.create({
            email,
            user: user._id,
            otpHash,
        });

        await sendEmail(
            email,
            "Password Reset OTP",
            `Your OTP code is ${otp}`,
            html,
        );

        res.status(200).json({
            message: "OTP sent to your email",
        });
    } catch (err) {
        res.status(400).json({
            message: "Error sending OTP",
            error: err.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: "Email, OTP and new password are required",
            });
        }

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        const otpDoc = await otpModel.findOne({
            email,
            otpHash,
        });

        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
            });
        }

        const user = await userModel.findById(otpDoc.user);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
        });

        await otpModel.deleteMany({
            user: otpDoc.user,
        });

        res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (err) {
        res.status(400).json({
            message: "Error resetting password",
            error: err.message,
        });
    }
};
