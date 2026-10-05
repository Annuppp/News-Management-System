import newsModel from "../models/news.model.js";
import commentModel from "../models/comment.model.js";

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
        const existingNews = await newsModel.findById(req.params.id);

        if (!existingNews) {
            return res.status(404).json({
                message: "News not found",
            });
        }

        const isAuthor = existingNews.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to update this news article",
            });
        }

        const updateData = {};
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.content !== undefined) updateData.content = req.body.content;
        if (req.body.category && typeof req.body.category === "string" && req.body.category.trim() !== "") {
            updateData.category = req.body.category.trim();
        }
        if (req.body.status !== undefined) updateData.status = req.body.status;
        if (req.file) updateData.image = req.file.path;

        const news = await newsModel
            .findByIdAndUpdate(req.params.id, updateData, {
                new: true,
                returnDocument: "after",
                runValidators: true,
            })
            .populate("category")
            .populate("author", "username email");

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
        const existingNews = await newsModel.findById(req.params.id);

        if (!existingNews) {
            return res.status(404).json({
                message: "News not found",
            });
        }

        const isAuthor = existingNews.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to delete this news article",
            });
        }

        await newsModel.findByIdAndDelete(req.params.id);
        await commentModel.deleteMany({ news: req.params.id });

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

        if (req.query.search && req.query.search.trim()) {
            const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.$or = [
                { title: { $regex: escaped, $options: "i" } },
                { content: { $regex: escaped, $options: "i" } },
            ];
        }

        const news = await newsModel
            .find(filter)
            .populate("category")
            .populate("author", "username")
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
