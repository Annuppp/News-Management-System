import newsModel from "../models/news.model.js";

export const getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        // Calculate stats
        const totalNews = await newsModel.countDocuments({ author: userId });
        const publishedNews = await newsModel.countDocuments({
            author: userId,
            status: "published",
        });
        const draftNews = await newsModel.countDocuments({
            author: userId,
            status: "draft",
        });

        // Get recent news (last 5)
        const recentNews = await newsModel
            .find({ author: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("category", "name"); // populate category name

        const stats = {
            totalNews,
            publishedNews,
            draftNews,
        };

        res.status(200).json({
            stats,
            recentNews,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching dashboard data",
            error: err.message,
        });
    }
};
