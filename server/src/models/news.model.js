import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
    },
    { timestamps: true },
);

const newsModel = mongoose.model("News", newsSchema);

export default newsModel;
