import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, ["username is required"]],
        },
        email: {
            type: String,
            required: [true, ["email is required"]],
        },
        image: {
            type: String,
        },

        password: {
            type: String,
            required: [true, ["password is required"]],
        },
        verified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    },
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
