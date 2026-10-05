import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  File,
  Plus,
  Pencil,
  Trash2,
  Globe,
  ExternalLink,
  Search,
  AlertCircle,
  Check,
} from "lucide-react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
  });
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'published' | 'draft'
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMessage, setActionMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await api.get("/user/dashboard");
      setStats(
        res.data.stats || { totalNews: 0, publishedNews: 0, draftNews: 0 },
      );
      setRecentNews(res.data.recentNews || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const showToast = (message, type = "success") => {
    setActionMessage({ message, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Quick toggle between draft and published
  const handleToggleStatus = async (newsId, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    setProcessingId(newsId);

    try {
      const formData = new FormData();
      formData.append("status", newStatus);

      await api.patch(`/news/update/${newsId}`, formData);

      // Update in local state
      setRecentNews((prev) =>
        prev.map((item) =>
          item._id === newsId ? { ...item, status: newStatus } : item,
        ),
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        publishedNews:
          newStatus === "published"
            ? prev.publishedNews + 1
            : Math.max(0, prev.publishedNews - 1),
        draftNews:
          newStatus === "draft"
            ? prev.draftNews + 1
            : Math.max(0, prev.draftNews - 1),
      }));

      showToast(
        `Article successfully ${
          newStatus === "published"
            ? "published live to Homepage!"
            : "moved to drafts."
        }`,
      );
    } catch (err) {
      console.error("Error updating status:", err);
      showToast(
        err.response?.data?.message || "Failed to update article status.",
        "error",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Delete news
  const handleDeleteNews = async (newsId, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    setProcessingId(newsId);
    try {
      await api.delete(`/news/delete/${newsId}`);

      const deletedItem = recentNews.find((item) => item._id === newsId);

      // Remove from local list
      setRecentNews((prev) => prev.filter((item) => item._id !== newsId));

      // Update stats
      setStats((prev) => ({
        totalNews: Math.max(0, prev.totalNews - 1),
        publishedNews:
          deletedItem?.status === "published"
            ? Math.max(0, prev.publishedNews - 1)
            : prev.publishedNews,
        draftNews:
          deletedItem?.status === "draft"
            ? Math.max(0, prev.draftNews - 1)
            : prev.draftNews,
      }));

      showToast(`"${title}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting news:", err);
      showToast(
        err.response?.data?.message || "Failed to delete article.",
        "error",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered news
  const filteredNews = useMemo(() => {
    return recentNews.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [recentNews, statusFilter, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 text-sm font-medium">
            Loading Dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Author Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your articles, publish drafts, and track your content
            performance.
          </p>
        </div>

        {/* Toast Alert */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border shadow-xs transition-all ${
              actionMessage.type === "error"
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-sky-50 text-sky-900 border-sky-200"
            }`}
          >
            {actionMessage.type === "error" ? (
              <AlertCircle size={18} className="text-red-500 shrink-0" />
            ) : (
              <Check size={18} className="text-sky-600 shrink-0" />
            )}
            <span>{actionMessage.message}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`p-5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
              statusFilter === "all"
                ? "bg-sky-50/50 border-sky-500 ring-2 ring-sky-200 shadow-xs"
                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <FileText size={18} />
            </div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              Total Articles
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {stats.totalNews}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`p-5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
              statusFilter === "published"
                ? "bg-sky-50/50 border-sky-500 ring-2 ring-sky-200 shadow-xs"
                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <CheckCircle size={18} />
            </div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              Published (Live)
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {stats.publishedNews}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("draft")}
            className={`p-5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
              statusFilter === "draft"
                ? "bg-sky-50/50 border-sky-500 ring-2 ring-sky-200 shadow-xs"
                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <File size={18} />
            </div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              Drafts (Private)
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {stats.draftNews}
            </p>
          </button>
        </div>

        {/* Articles Management Panel */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          {/* Header Controls: Filters and Search */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-sky-500 text-white shadow-xs"
                    : "text-gray-600 hover:text-sky-600 hover:bg-sky-50"
                }`}
              >
                All ({recentNews.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("published")}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "published"
                    ? "bg-sky-500 text-white shadow-xs"
                    : "text-gray-600 hover:text-sky-600 hover:bg-sky-50"
                }`}
              >
                Published ({stats.publishedNews})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "draft"
                    ? "bg-sky-500 text-white shadow-xs"
                    : "text-gray-600 hover:text-sky-600 hover:bg-sky-50"
                }`}
              >
                Drafts ({stats.draftNews})
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Filter articles by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Articles List */}
          {filteredNews.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <File size={32} />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                {searchQuery || statusFilter !== "all"
                  ? "No matching articles found"
                  : "No news articles yet"}
              </h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search terms or filter selection."
                  : "You haven't written any news stories yet. Start publishing your first article today."}
              </p>
              <Link
                to="/create-news"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 py-2 rounded-lg shadow-xs transition text-sm"
              >
                <Plus size={16} />
                Write an Article
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNews.map((news) => {
                const isDraft = news.status === "draft";
                const isProcessing = processingId === news._id;

                return (
                  <div
                    key={news._id}
                    className="p-5 sm:p-6 hover:bg-gray-50/70 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    {/* Left: Article Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                        {/* Status badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${
                            isDraft
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {isDraft ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Draft
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Published
                            </>
                          )}
                        </span>

                        {/* Category badge */}
                        {news.category && (
                          <span className="bg-sky-100 text-sky-800 text-xs px-2.5 py-0.5 rounded font-medium">
                            {news.category.name}
                          </span>
                        )}

                        {/* Creation date */}
                        <span className="text-gray-400 text-xs">
                          {new Date(news.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      {/* Article Title */}
                      <Link
                        to={`/news/${news._id}`}
                        className="text-base sm:text-lg font-semibold text-gray-900 hover:text-sky-600 transition truncate block"
                        title={news.title}
                      >
                        {news.title}
                      </Link>
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {/* Quick Publish / Move to Draft button */}
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleToggleStatus(news._id, news.status)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 border disabled:opacity-50 ${
                          isDraft
                            ? "bg-sky-500 hover:bg-sky-600 text-white border-transparent shadow-xs"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                        }`}
                        title={
                          isDraft
                            ? "Publish to Homepage"
                            : "Unpublish (Move back to Draft)"
                        }
                      >
                        {isDraft ? (
                          <>
                            <Globe size={13} />
                            Publish
                          </>
                        ) : (
                          <>
                            <FileText size={13} />
                            Move to Draft
                          </>
                        )}
                      </button>

                      {/* Edit News button */}
                      <Link
                        to={`/news/edit/${news._id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 transition inline-flex items-center gap-1.5"
                        title="Edit article"
                      >
                        <Pencil size={13} />
                        Edit
                      </Link>

                      {/* View article button */}
                      <Link
                        to={`/news/${news._id}`}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 transition inline-flex items-center gap-1"
                        title="View article"
                      >
                        <ExternalLink size={13} />
                      </Link>

                      {/* Delete News button */}
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleDeleteNews(news._id, news.title)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-300 hover:border-red-300 transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                        title="Delete article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
