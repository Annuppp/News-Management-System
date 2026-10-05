import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    X,
    Calendar,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Newspaper,
    Sparkles,
} from "lucide-react";
import api, { getImageUrl } from "../services/api";

const getPlainTextExcerpt = (markdown = "") => {
    return markdown
        .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
        .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // clean links
        .replace(/[#*`_~>-]/g, "") // clean markdown tokens
        .replace(/\n+/g, " ")
        .trim();
};

function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();

    const [debouncedSearch, setDebouncedSearch] = useState("");

    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get("/category/getAll");
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    }, []);

    const fetchNews = useCallback(async (page = 1, isSearch = false) => {
        try {
            if (isSearch) {
                setIsSearching(true);
            } else {
                setLoading(true);
            }

            const categoryQuery = selectedCategory
                ? `&category=${selectedCategory}`
                : "";

            const searchQueryStr = debouncedSearch
                ? `&search=${encodeURIComponent(debouncedSearch)}`
                : "";

            const res = await api.get(
                `/news?page=${page}&limit=6${categoryQuery}${searchQueryStr}`,
            );
            setNews(res.data.news || []);
            setCurrentPage(res.data.pagination?.currentPage || 1);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setTotalItems(
                res.data.pagination?.totalItems ||
                    (res.data.news ? res.data.news.length : 0),
            );
        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            if (isSearch) {
                setIsSearching(false);
            } else {
                setLoading(false);
            }
        }
    }, [selectedCategory, debouncedSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchNews(1, Boolean(debouncedSearch));
    }, [fetchNews, debouncedSearch, selectedCategory]);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Modern Headline Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 mb-3">
                        <Sparkles size={13} className="text-sky-500" />
                        Live Feed & Headlines
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                        Explore Today&apos;s Stories
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base mt-1.5 max-w-xl">
                        Discover verified articles, breaking headlines, and in-depth reporting across categories.
                    </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-wrap">
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer shrink-0 ${
                                selectedCategory === null
                                    ? "bg-sky-500 text-white shadow-xs"
                                    : "bg-white text-gray-700 border border-gray-200 hover:border-sky-300 hover:bg-sky-50/60 hover:text-sky-700"
                            }`}
                        >
                            All Stories
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => handleCategoryClick(category._id)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer shrink-0 ${
                                    selectedCategory === category._id
                                        ? "bg-sky-500 text-white shadow-xs"
                                        : "bg-white text-gray-700 border border-gray-200 hover:border-sky-300 hover:bg-sky-50/60 hover:text-sky-700"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Integrated Search Input */}
                    <div className="relative w-full md:w-72 shrink-0">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition shadow-xs"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                                title="Clear search"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State Skeleton */}
                {loading && !isSearching ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className="bg-white rounded-2xl border border-gray-200/80 p-0 overflow-hidden shadow-xs animate-pulse flex flex-col"
                            >
                                <div className="h-48 sm:h-52 bg-gray-200/80"></div>
                                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex gap-2 mb-3">
                                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        </div>
                                        <div className="h-5 bg-gray-200 rounded w-4/5 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : news.length === 0 ? (
                    /* Modern Empty State */
                    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs max-w-lg mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-4">
                            <Newspaper size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {debouncedSearch ? "No articles found" : "No published news yet"}
                        </h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-5">
                            {debouncedSearch
                                ? `We couldn't find any articles matching "${debouncedSearch}". Try another search term or category.`
                                : "Check back later or publish your own story from the Author Dashboard."}
                        </p>
                        {(debouncedSearch || selectedCategory) && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory(null);
                                }}
                                className="px-4 py-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    /* News Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                        {news.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/news/${item._id}`)}
                                className="group bg-white rounded-2xl border border-gray-200/80 hover:border-sky-300 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
                            >
                                {/* Cover Image or Modern Placeholder */}
                                <div className="h-48 sm:h-52 w-full overflow-hidden bg-gray-100 relative">
                                    {item.image ? (
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-gray-100 text-sky-400">
                                            <Newspaper size={38} className="text-sky-300 mb-1" />
                                            <span className="text-xs font-medium text-gray-400">
                                                Editorial Story
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Article Info */}
                                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            {item.category && (
                                                <span className="bg-sky-50 text-sky-700 border border-sky-200/70 text-xs px-2.5 py-0.5 rounded-md font-medium">
                                                    {item.category.name}
                                                </span>
                                            )}
                                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        <h2 className="font-bold text-gray-900 text-base sm:text-lg leading-snug group-hover:text-sky-600 transition-colors line-clamp-2 mb-2">
                                            {item.title}
                                        </h2>

                                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                                            {getPlainTextExcerpt(item.content)}
                                        </p>
                                    </div>

                                    {/* Author & Read More Footer */}
                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-semibold flex items-center justify-center text-[11px]">
                                                {item.author?.username
                                                    ? item.author.username.charAt(0).toUpperCase()
                                                    : "N"}
                                            </div>
                                            <span className="font-medium text-gray-700 truncate max-w-[120px]">
                                                {item.author?.username || "Staff Reporter"}
                                            </span>
                                        </div>

                                        <span className="font-semibold text-sky-600 group-hover:text-sky-700 inline-flex items-center gap-1 transition-all">
                                            Read
                                            <ArrowRight
                                                size={13}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modern Editorial Pagination Bar */}
                {news.length > 0 && (
                    <div className="mt-12 pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Summary / Counter */}
                        <div className="text-xs sm:text-sm text-gray-500 font-medium order-2 sm:order-1">
                            Showing{" "}
                            <span className="text-gray-900 font-semibold">
                                {Math.min(
                                    (currentPage - 1) * 6 + 1,
                                    totalItems || news.length,
                                )}
                            </span>{" "}
                            to{" "}
                            <span className="text-gray-900 font-semibold">
                                {Math.min(
                                    currentPage * 6,
                                    totalItems || news.length,
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="text-gray-900 font-semibold">
                                {totalItems || news.length}
                            </span>{" "}
                            articles
                        </div>

                        {/* Navigation controls */}
                        <div className="flex items-center gap-2 order-1 sm:order-2 flex-wrap justify-center">
                            {/* Previous Button */}
                            <button
                                onClick={() => fetchNews(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3.5 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-700 transition flex items-center gap-1.5 text-xs sm:text-sm font-medium shadow-xs cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                                <span>Previous</span>
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => fetchNews(pageNum)}
                                            className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                                                currentPage === pageNum
                                                    ? "bg-sky-500 text-white shadow-xs shadow-sky-500/25 ring-2 ring-sky-200"
                                                    : "bg-white text-gray-600 border border-gray-200 hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-700"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ),
                                )}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => fetchNews(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3.5 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-700 transition flex items-center gap-1.5 text-xs sm:text-sm font-medium shadow-xs cursor-pointer"
                            >
                                <span>Next</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
