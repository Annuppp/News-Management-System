import categoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Every field is required",
            });
        }

        const category = await categoryModel.create({
            name,
            description,
        });

        res.status(201).json({
            message: "Successfully created a category",
            category,
        });
    } catch (err) {
        res.status(404).json({
            message: "Error creating a category",
            error: err.message,
        });
    }
};

export const getAllCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find();

        if (!categories) {
            return res.status(400).json({
                message: "Unable to find the categories",
            });
        }

        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({
            message: "Error getting all the categories",
            error: err.message,
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await categoryModel.findById(id);

        if (!category) {
            return res.status(400).json({
                message: "Unable to find the category",
            });
        }

        res.status(200).json({
            message: "Category fetched successfully",
            category,
        });
    } catch (err) {
        res.status(400).json({
            message: "Error getting categories by ID",
            error: err.message,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const updateCategory = await categoryModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!updateCategory) {
            return res.status(404).json({
                message: " Category not found",
            });
        }

        res.status(200).json({
            message: "Category updated",
            updateCategory,
        });
    } catch (err) {
        res.status(400).json({
            message: "Error updating the category",
            error: err.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const deleteCategory = await categoryModel.findByIdAndDelete(
            req.params.id,
        );

        if (!deleteCategory) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        res.status(200).json({
            message: "Category deleted",
            deleteCategory,
        });
    } catch (err) {
        res.status(400).json({
            message: "Error deleting the category",
            error: err.message,
        });
    }
};
