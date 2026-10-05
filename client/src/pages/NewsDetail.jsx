import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { getImageUrl } from "../services/api";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    const [comments, setComments] = useState([]);
    const [commentBody, setCommentBody] = useState("");
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentError, setCommentError] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const res = await api.get("/user/getMe");
            setCurrentUser(res.data.user);
        } catch (err) {
            console.error("Error fetching the current user", err);
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    setCurrentUser(JSON.parse(storedUser));
                } catch {
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
        }
    }, []);

    const fetchComments = useCallback(async () => {
        try {
            const res = await api.get(`/comment/${id}`);
            setComments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    }, [id]);

    const fetchNewsDetail = useCallback(async () => {
        try {
            const res = await api.get(`/news/${id}`);
            setNews(res.data);
        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        fetchNewsDetail();
    }, [fetchNewsDetail]);

    // deleting the news
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this news article?")) return;

        try {
            await api.delete(`/news/delete/${id}`);
            navigate("/");
        } catch (err) {
            console.error("Error deleting news:", err);
            alert(err.response?.data?.message || "Failed to delete news article");
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentBody.trim()) return;

        setSubmittingComment(true);
        setCommentError("");
        try {
            await api.post("/comment/create", {
                body: commentBody.trim(),
                newsId: id,
            });
            setCommentBody("");
            setShowCommentForm(false);
            fetchComments();
        } catch (err) {
            console.error("Error creating comment:", err);
            setCommentError(
                err.response?.data?.message || "Failed to post comment. Please try again."
            );
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!news) return <div className="p-8">News not found</div>;

    const imageUrl = news.image ? getImageUrl(news.image) : "";

    return (
        <>
            <Helmet>
                <title>{news.title}</title>
                <meta
                    name="description"
                    content={news.content.substring(0, 160)}
                />
                <meta property="og:title" content={news.title} />
                <meta
                    property="og:description"
                    content={news.content.substring(0, 160)}
                />
                <meta
                    property="og:image"
                    content={imageUrl || "/og-image.jpg"}
                />
                <meta
                    property="og:url"
                    content={window.location.href}
                />
            </Helmet>
            <div className="p-8 max-w-4xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-sky-500 hover:text-sky-600 flex items-center gap-2"
                >
                    ← Back
                </button>

                {/* News Image */}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={news.title}
                        className="w-full h-96 object-cover rounded-lg mb-6"
                    />
                )}

                {/* Category and Date */}
                <div className="flex items-center gap-4 mb-4">
                    {news.category && (
                        <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
                            {news.category.name}
                        </span>
                    )}
                    <span className="text-gray-500 text-sm">
                        {new Date(news.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-6">{news.title}</h1>

                {/* Author Info */}
                {news.author && (
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                        <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                            {news.author.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold">
                                {news.author.username}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {news.author.email}
                            </p>
                        </div>
                    </div>
                )}

                {/* Full Content */}
                <div className="prose max-w-none">
                    <div className="text-gray-700 leading-relaxed">
                        <ReactMarkdown>{news.content}</ReactMarkdown>
                    </div>
                </div>

                {currentUser &&
                    news.author &&
                    currentUser.email === news.author.email && (
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={() => navigate(`/news/edit/${id}`)}
                                className="bg-sky-500 text-white px-4 py-2 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    )}

                {/* Status Badge */}
                <div className="mt-8">
                    <span
                        className={`text-xs px-3 py-1 rounded-full capitalize ${
                            news.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {news.status}
                    </span>
                </div>

                {/* Comments Section */}
                <div className="mt-8 border-t pt-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Comments ({comments.length})
                    </h2>

                    {/* Comment Form */}
                    {currentUser ? (
                        <div className="mb-6">
                            {!showCommentForm ? (
                                <button
                                    onClick={() => setShowCommentForm(true)}
                                    className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
                                >
                                    Add Comment
                                </button>
                            ) : (
                                <form
                                    onSubmit={handleCommentSubmit}
                                    className="mb-4"
                                >
                                    <textarea
                                        value={commentBody}
                                        onChange={(e) =>
                                            setCommentBody(e.target.value)
                                        }
                                        placeholder="Write your comment..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        rows="3"
                                        required
                                    />
                                    {commentError && (
                                        <p className="text-red-500 text-sm mb-2">
                                            {commentError}
                                        </p>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="submit"
                                            disabled={submittingComment}
                                            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition disabled:opacity-50"
                                        >
                                            {submittingComment ? "Submitting..." : "Submit"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCommentForm(false);
                                                setCommentError("");
                                            }}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500 mb-6">
                            <a
                                href="/login"
                                className="text-sky-500 hover:underline"
                            >
                                Login
                            </a>{" "}
                            to add comments
                        </p>
                    )}

                    {/* Comments List */}
                    {comments.length === 0 ? (
                        <p className="text-gray-500">No comments yet</p>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="bg-gray-50 p-4 rounded-lg"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {comment.user.username
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {comment.user.username}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {new Date(
                                                    comment.createdAt,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">
                                        {comment.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NewsDetail;
