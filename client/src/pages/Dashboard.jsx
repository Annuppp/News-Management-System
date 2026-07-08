import { useState, useEffect } from "react";
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
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm">Total News</h3>
                    <p className="text-3xl font-bold text-sky-500">
                        {stats.totalNews}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm">Published</h3>
                    <p className="text-3xl font-bold text-green-500">
                        {stats.publishedNews}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
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
                    <p className="text-gray-500">No news articles yet</p>
                ) : (
                    <div className="space-y-4">
                        {recentNews.map((news) => (
                            <div key={news._id} className="border-b pb-4">
                                <h3 className="font-semibold">{news.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        news.createdAt,
                                    ).toLocaleDateString()}
                                </p>
                                <span
                                    className={`text-xs px-2 py-1 rounded ${
                                        news.status === "published"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {news.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
