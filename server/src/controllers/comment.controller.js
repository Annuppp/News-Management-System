import commentModel from "../models/comment.model.js";

export const createComment = async (req, res) => {
    try {
        const { body, newsId } = req.body;

        if (!body || !body.trim() || !newsId) {
            return res.status(400).json({
                message: "Comment body and newsId are required",
            });
        }

        const comment = await commentModel.create({
            user: req.user._id,
            news: newsId,
            body: body.trim(),
        });

        // populate user details for response
        const populatedComment = await commentModel
            .findById(comment._id)
            .populate("user", "username email")
            .populate("news", "title");

        res.status(201).json({
            message: "Comment created successfully",
            comment: populatedComment,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

export const getCommentsByNews = async (req, res) => {
    try {
        const { newsId } = req.params;

        const comments = await commentModel
            .find({ news: newsId })
            .populate("user", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
