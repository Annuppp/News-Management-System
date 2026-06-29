import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import InputField from "../components/InputField";

function ForgotPassword() {
    const [form, setForm] = useState({
        email: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await api.post("/user/forgot-password", form);
            alert("OTP sent to your email!");
            navigate("/reset-password");
        } catch (err) {
            setErrors({
                server:
                    err.response?.data?.message ||
                    "Error sending OTP. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        {
            label: "Email",
            type: "email",
            placeholder: "Enter your email",
            name: "email",
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Forgot Password
                </h2>
                <p className="text-gray-600 text-sm mb-6 text-center">
                    Enter your email to receive a password reset OTP
                </p>

                {fields.map((field) => (
                    <InputField
                        key={field.name}
                        {...field}
                        value={form[field.name]}
                        onChange={handleChange}
                        error={errors[field.name]}
                    />
                ))}

                {errors.server && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {errors.server}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white p-3 rounded-lg font-medium hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full mt-3 text-sky-500 hover:text-sky-600 text-sm"
                >
                    Back to Login
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;
