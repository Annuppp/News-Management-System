import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import MDEditor from "@uiw/react-md-editor";
import { FileText, Globe, ArrowLeft, Image as ImageIcon } from "lucide-react";
import CategorySelector from "../components/CategorySelector";

const CreateNews = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
        status: "published",
        image: "",
    });

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(true);
    const [error, setError] = useState("");

    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get("/category/getAll");
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching categories", err);
        } finally {
            setFetchingCategories(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("content", formData.content);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("status", formData.status);
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            await api.post("/news/create", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating news:", err);
            setError(
                err.response?.data?.message ||
                    "Error creating news. Please check your inputs.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50/60 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-10">
                    <div className="mb-8 pb-6 border-b border-gray-100">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Create News Article
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Write and publish stories, news updates, and articles for your audience.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center justify-between">
                            <span>{error}</span>
                        </div>
                    )}

                    {fetchingCategories ? (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-sm">Loading category data...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter an engaging headline..."
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-3.5 bg-white text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-medium shadow-xs text-sm sm:text-base placeholder:text-gray-400 transition"
                                    required
                                />
                            </div>

                            {/* Category Selector */}
                            <div>
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <CategorySelector
                                    categories={categories}
                                    selectedId={formData.category}
                                    onSelect={(categoryId) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: categoryId,
                                        }))
                                    }
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Article Content <span className="text-red-500">*</span>
                                </label>
                                <div
                                    data-color-mode="light"
                                    className="rounded-xl overflow-hidden border border-gray-300 shadow-xs"
                                >
                                    <MDEditor
                                        value={formData.content}
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                content: value || "",
                                            }))
                                        }
                                        height={260}
                                    />
                                </div>
                            </div>

                            {/* Status Card Selector */}
                            <div>
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Publishing Status
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                status: "draft",
                                            }))
                                        }
                                        className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center gap-3 ${
                                            formData.status === "draft"
                                                ? "border-sky-500 bg-sky-50/60 text-sky-950 ring-2 ring-sky-200"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-sky-300 hover:bg-sky-50/30"
                                        }`}
                                    >
                                        <div
                                            className={`p-2 rounded-lg shrink-0 ${
                                                formData.status === "draft"
                                                    ? "bg-sky-500 text-white"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900">
                                                Save as Draft
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                Only visible to you on your dashboard
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                status: "published",
                                            }))
                                        }
                                        className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center gap-3 ${
                                            formData.status === "published"
                                                ? "border-sky-500 bg-sky-50/60 text-sky-950 ring-2 ring-sky-200"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-sky-300 hover:bg-sky-50/30"
                                        }`}
                                    >
                                        <div
                                            className={`p-2 rounded-lg shrink-0 ${
                                                formData.status === "published"
                                                    ? "bg-sky-500 text-white"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            <Globe size={18} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900">
                                                Publish Immediately
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                Publicly live for all readers
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Cover Image Upload */}
                            <div>
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Cover Image (Optional)
                                </label>
                                <div className="border border-gray-300 rounded-xl p-4 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                        <ImageIcon size={22} />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    image: e.target.files[0],
                                                }));
                                            }}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                                            accept="image/*"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            PNG, JPG, or WEBP up to 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer text-sm flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>
                                                {formData.status === "published"
                                                    ? "Publishing..."
                                                    : "Saving Draft..."}
                                            </span>
                                        </>
                                    ) : (
                                        <span>
                                            {formData.status === "published"
                                                ? "Publish News"
                                                : "Save as Draft"}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateNews;
