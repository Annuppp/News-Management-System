import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import MDEditor from "@uiw/react-md-editor";

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
        status: "draft",
        image: "",
    });

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/category/getAll");
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        } finally {
            setFetchingCategories(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("content", formData.content);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("status", formData.status);
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            const res = await api.post("/news/create", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating news:", err);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCategories) {
        return <div className="p-8">Loading categories...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Create News</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Content
                    </label>
                    <div data-color-mode="light">
                        <MDEditor
                            value={formData.content}
                            onChange={(value) =>
                                setFormData({
                                    ...formData,
                                    content: value || "",
                                })
                            }
                            height={200}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Image (optional)
                    </label>
                    <input
                        type="file"
                        name="image"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                image: e.target.files[0],
                            });
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        accept="image/*"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create News"}
                </button>
            </form>
        </div>
    );
};

export default CreateNews;
