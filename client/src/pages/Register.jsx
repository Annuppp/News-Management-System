import { useState } from "react";
import api from "../services/api";
import InputField from "../components/InputField";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fields defined as data — add one object to add a field
    const fields = [
        {
            label: "Username",
            type: "text",
            placeholder: "Enter your username",
            name: "username",
        },
        {
            label: "Email",
            type: "email",
            placeholder: "Enter your email",
            name: "email",
        },
        {
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            name: "password",
        },
        {
            label: "Confirm Password",
            type: "password",
            placeholder: "Re-enter your password",
            name: "confirmPassword",
        },
    ];

    // Single handler for ALL fields — uses name attribute
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!image) {
            newErrors.image = "Profile image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("username", form.username);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("image", image);

            const res = await api.post("/user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Registered Successfully");
        } catch (err) {
            setErrors({
                server:
                    err.response?.data?.message ||
                    "Registration failed. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Register
                </h2>

                {/* One line renders all fields */}
                {fields.map((field) => (
                    <InputField
                        key={field.name}
                        {...field}
                        value={form[field.name]}
                        onChange={handleChange}
                        error={errors[field.name]}
                    />
                ))}

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                        Profile Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                    {errors.image && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.image}
                        </p>
                    )}
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-24 h-24 object-cover rounded-lg"
                        />
                    )}
                </div>

                {errors.server && (
                    <p className="text-red-500 text-sm mb-2 text-center">
                        {errors.server}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white p-3 rounded-lg font-medium hover:bg-sky-600 transition disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}

export default Register;
