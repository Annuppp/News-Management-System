import newsModel from "../models/news.model.js";

export const createNews = async (req, res) => {
    try {
        const news = await newsModel.create({
            ...req.body,
            author: req.user._id,
            image: req.file?.path,
        });

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

export const getNewsById = async (req, res) => {
    try {
        const news = await newsModel
            .findById(req.params.id)
            .populate("category")
            .populate("author", "username email");

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
            .findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                    image: req.file?.path,
                },
                {
                    returnDocument: "after",
                    runValidators: true,
                },
            )
            .populate("category")
            .populate("author", "username email");

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
        const news = await newsModel
            .findByIdAndDelete(req.params.id)
            .populate("category")
            .populate("author", "username email");

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

export const getAllNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const filter = { status: "published" };
        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: "i" } },
                { content: { $regex: req.query.search, $options: "i" } },
            ];
        }

        const news = await newsModel
            .find(filter)
            .populate("category")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await newsModel.countDocuments(filter);
        const totalPages = Math.ceil(total / limit) || 1;

        res.status(200).json({
            news,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: total,
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
