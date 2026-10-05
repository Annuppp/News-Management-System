import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        otpHash: {
            type: String,
            required: [true, "OTP hash is required"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600, // 10 minutes
        },
    },
    { timestamps: true },
);

const otpModel = mongoose.model("otp", otpSchema);

export default otpModel;
