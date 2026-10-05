import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { getImageUrl } from "../services/api";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
import { Pencil, Trash2, Globe, FileText, ArrowLeft } from "lucide-react";

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    });

    const [comments, setComments] = useState([]);
    const [commentBody, setCommentBody] = useState("");
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentError, setCommentError] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [togglingStatus, setTogglingStatus] = useState(false);

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

    // toggling article status (draft <-> published)
    const handleToggleStatus = async () => {
        if (!news) return;
        const newStatus = news.status === "published" ? "draft" : "published";
        setTogglingStatus(true);
        try {
            const formData = new FormData();
            formData.append("status", newStatus);
            await api.patch(`/news/update/${id}`, formData);
            setNews((prev) => ({ ...prev, status: newStatus }));
        } catch (err) {
            console.error("Error toggling status:", err);
            alert(err.response?.data?.message || "Failed to update article status");
        } finally {
            setTogglingStatus(false);
        }
    };

    // deleting the news
    const handleDelete = async () => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${news?.title || "this article"}"? This action cannot be undone.`
            )
        )
            return;

        try {
            await api.delete(`/news/delete/${id}`);
            navigate("/dashboard");
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

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500 text-sm font-medium">Loading article...</span>
                </div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-8">
                <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        This article may have been deleted or the link is invalid.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-sky-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-600 transition text-sm cursor-pointer"
                    >
                        Back to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const imageUrl = news.image ? getImageUrl(news.image) : "";

    const isAuthor = Boolean(
        currentUser &&
        (currentUser.role === "admin" ||
         (news?.author && (
             (typeof news.author === "string" && (
                 String(currentUser.id || currentUser._id) === String(news.author)
             )) ||
             (news.author._id && (
                 String(currentUser.id || currentUser._id) === String(news.author._id)
             )) ||
             (news.author.id && (
                 String(currentUser.id || currentUser._id) === String(news.author.id)
             )) ||
             (news.author.email && currentUser.email && (
                 currentUser.email.toLowerCase() === news.author.email.toLowerCase()
             ))
         )))
    );

    const isDraft = news.status === "draft";

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

            <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Top Bar with Navigation and Author Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        {/* Author Actions Header Bar */}
                        {isAuthor && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Quick Publish / Draft button */}
                                <button
                                    type="button"
                                    disabled={togglingStatus}
                                    onClick={handleToggleStatus}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 border disabled:opacity-50 ${
                                        isDraft
                                            ? "bg-sky-500 hover:bg-sky-600 text-white border-sky-500 shadow-sm"
                                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                                    }`}
                                >
                                    {isDraft ? (
                                        <>
                                            <Globe size={13} />
                                            Publish to Homepage
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={13} />
                                            Move to Draft
                                        </>
                                    )}
                                </button>

                                {/* Edit Button */}
                                <button
                                    onClick={() => navigate(`/news/edit/${id}`)}
                                    className="bg-white hover:bg-sky-50 text-gray-700 hover:text-sky-700 border border-gray-200 hover:border-sky-300 px-3.5 py-1.5 rounded-lg font-medium text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Pencil size={13} />
                                    Edit Article
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={handleDelete}
                                    className="bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg font-medium text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Trash2 size={13} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Main Article Container */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-10 mb-8">
                        {/* Status Warning Banner if Draft */}
                        {isDraft && (
                            <div className="mb-6 p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-sky-900 text-xs sm:text-sm font-medium">
                                    <FileText size={16} className="text-sky-600 shrink-0" />
                                    <span>
                                        This article is currently a <strong>Draft</strong> and only visible to you.
                                    </span>
                                </div>
                                <button
                                    onClick={handleToggleStatus}
                                    className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 shadow-xs"
                                >
                                    Publish Now
                                </button>
                            </div>
                        )}

                        {/* News Image */}
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={news.title}
                                className="w-full h-72 sm:h-96 object-cover rounded-xl mb-6 shadow-xs"
                            />
                        )}

                        {/* Category and Date */}
                        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                            {news.category && (
                                <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded text-xs font-medium">
                                    {news.category.name}
                                </span>
                            )}
                            <span
                                className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${
                                    isDraft
                                        ? "bg-gray-100 text-gray-600 border-gray-200"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                                }`}
                            >
                                {isDraft ? "Draft" : "Published"}
                            </span>
                            <span className="text-gray-400 text-xs">
                                {new Date(news.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                            {news.title}
                        </h1>

                        {/* Author Info */}
                        {news.author && (
                            <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-gray-100">
                                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-xs">
                                    {news.author.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                        {news.author.username}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {news.author.email}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Full Content */}
                        <div className="prose max-w-none text-gray-800 leading-relaxed text-base sm:text-lg">
                            <ReactMarkdown>{news.content}</ReactMarkdown>
                        </div>

                        {/* Bottom Actions for Author */}
                        {isAuthor && (
                            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                                <div className="text-xs text-gray-400">
                                    You are the author of this article.
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <button
                                        onClick={() => navigate(`/news/edit/${id}`)}
                                        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <Pencil size={15} />
                                        Edit Article
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition inline-flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
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
            </div>
        </>
    );
};

export default NewsDetail;
