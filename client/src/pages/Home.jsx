import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchNews(1);
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/category/getAll");
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };
    const fetchNews = async (page = 1) => {
        try {
            setLoading(true);

            const categoryQuery = selectedCategory
                ? `&category=${selectedCategory}`
                : "";

            const res = await api.get(
                `/news?page=${page}&limit=5${categoryQuery}`,
            );
            setNews(res.data.news);
            setCurrentPage(res.data.pagination.currentPage);
            setTotalPages(res.data.pagination.totalPages);
        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Latest News</h1>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => handleCategoryClick(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedCategory === null
                            ? "bg-sky-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-sky-100"
                    }`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category._id}
                        onClick={() => handleCategoryClick(category._id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            selectedCategory === category._id
                                ? "bg-sky-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-sky-100"
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

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

            {news.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => fetchNews(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-sky-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 transition"
                    >
                        Previous
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => fetchNews(pageNum)}
                                className={`w-10 h-10 rounded-lg font-medium transition ${
                                    currentPage === pageNum
                                        ? "bg-sky-500 text-white"
                                        : "bg-white text-gray-700 hover:bg-sky-100"
                                }`}
                            >
                                {pageNum}
                            </button>
                        ),
                    )}

                    <button
                        onClick={() => fetchNews(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-sky-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Home;
