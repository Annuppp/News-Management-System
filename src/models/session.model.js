import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "user is required"],
        },

        refreshTokenHash: {
            type: String,
            required: [true, "refreshTokenHash is required"],
        },

        ip: {
            type: String,
            required: [true, "Ip Address is required"],
        },
        userAgent: {
            type: String,
            required: [true, "userAgent is required"],
        },
        revoked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;
