import newsModel from "../models/news.model.js";

export const createNews = async (req, res) => {
    try {
        const news = await newsModel.create(req.body);

        res.status(201).json({
            message: "News created successfully",
            news,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getAllNews = async (req, res) => {
    try {
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const news = await newsModel
            .find(filter)
            .populate("category")
            .sort({ createdAt: -1 });

        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getNewsById = async (req, res) => {
    try {
        const news = await newsModel
            .findById(req.params.id)
            .populate("category");

        if (!news) {
            return res.status(404).json({
                message: "News not found",
            });
        }

        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateNews = async (req, res) => {
    try {
        const news = await newsModel
            .findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            })
            .populate("category");

        if (!news) {
            return res.status(404).json({
                message: "News not found",
            });
        }

        res.status(200).json({
            message: "News updated successfully",
            news,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteNews = async (req, res) => {
    try {
        const news = await newsModel.findByIdAndDelete(req.params.id);

        if (!news) {
            return res.status(404).json({
                message: "News not found",
            });
        }

        res.status(200).json({
            message: "News deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
