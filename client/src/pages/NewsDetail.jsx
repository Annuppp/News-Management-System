import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get("/user/getMe");
            setCurrentUser(res.data.user);
        } catch (err) {
            console.error("Error fetching the current user", err);
            setCurrentUser(null); // Set to null on error
        }
    };

    useEffect(() => {
        fetchNewsDetail();
    }, [id]);

    const fetchNewsDetail = async () => {
        try {
            const res = await api.get(`/news/${id}`);
            setNews(res.data);
        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            setLoading(false);
        }
    };

    // deleting the news
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this news?")) return;

        try {
            await api.delete(`/news/delete/${id}`);
            navigate("/");
        } catch (err) {
            console.error("Error deleting news:", err);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!news) return <div className="p-8">News not found</div>;

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
                    content={
                        news.image
                            ? `http://localhost:3000/${news.image.replace("src/uploads/", "uploads/")}`
                            : "/og-image.jpg"
                    }
                />
                <meta
                    property="og:url"
                    content={`http://localhost:5173/news/${id}`}
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
                {news.image && (
                    <img
                        src={`http://localhost:3000/${news.image.replace("src/uploads/", "uploads/")}`}
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
            </div>
        </>
    );
};

export default NewsDetail;
