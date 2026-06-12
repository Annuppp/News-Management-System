import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        description: String,
    },
    { timestamps: true },
);

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
