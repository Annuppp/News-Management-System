import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, File } from "lucide-react";
import api from "../services/api";

function Dashboard() {
    const [stats, setStats] = useState({
        totalNews: 0,
        publishedNews: 0,
        draftNews: 0,
    });
    const [recentNews, setRecentNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get("/user/dashboard");
            setStats(res.data.stats);
            setRecentNews(res.data.recentNews);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <FileText size={32} className="text-sky-500 mb-2" />
                    <h3 className="text-gray-500 text-sm">Total News</h3>
                    <p className="text-3xl font-bold text-sky-500">
                        {stats.totalNews}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CheckCircle size={32} className="text-green-500 mb-2" />
                    <h3 className="text-gray-500 text-sm">Published</h3>
                    <p className="text-3xl font-bold text-green-500">
                        {stats.publishedNews}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <File size={32} className="text-yellow-500 mb-2" />
                    <h3 className="text-gray-500 text-sm">Drafts</h3>
                    <p className="text-3xl font-bold text-yellow-500">
                        {stats.draftNews}
                    </p>
                </div>
            </div>

            {/* Recent News */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Recent News</h2>
                {recentNews.length === 0 ? (
                    <div className="text-center py-12">
                        <File
                            size={48}
                            className="text-gray-400 mx-auto mb-4"
                        />
                        <p className="text-gray-500 mb-4">
                            No news articles yet
                        </p>
                        <Link
                            to="/create-news"
                            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition inline-block"
                        >
                            Create your first article
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentNews.map((news) => (
                            <div
                                key={news._id}
                                className="border-b pb-4 last:border-0 hover:bg-gray-50 p-3 rounded-lg transition"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {news.title}
                                    </h3>
                                    <span
                                        className={`text-xs px-2 py-1 rounded capitalize ${
                                            news.status === "published"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {news.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>
                                        {new Date(
                                            news.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                    {news.category && (
                                        <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded text-xs">
                                            {news.category.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
