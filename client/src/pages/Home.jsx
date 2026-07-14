import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Home() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await api.get("/news");
            // Filter only published news
            const publishedNews = res.data.filter(
                (item) => item.status === "published",
            );
            setNews(publishedNews);
        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Latest News</h1>

            {news.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No published news yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => navigate(`/news/${item._id}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                        >
                            {item.image && (
                                <img
                                    src={`http://localhost:3000/${item.image.replace("src/uploads/", "uploads/")}`}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {item.category && (
                                        <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">
                                            {item.category.name}
                                        </span>
                                    )}
                                    <span className="text-gray-500 text-xs">
                                        {new Date(
                                            item.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
