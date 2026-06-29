import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import InputField from "../components/InputField";

function ResetPassword() {
    const [form, setForm] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        if (!form.otp.trim()) {
            newErrors.otp = "OTP is required";
        } else if (form.otp.length !== 6) {
            newErrors.otp = "OTP must be 6 digits";
        }

        if (!form.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (form.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await api.post("/user/reset-password", {
                email: form.email,
                otp: form.otp,
                newPassword: form.newPassword,
            });
            alert("Password reset successfully!");
            navigate("/login");
        } catch (err) {
            setErrors({
                server:
                    err.response?.data?.message ||
                    "Error resetting password. Please try again.",
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
        {
            label: "OTP",
            type: "text",
            placeholder: "Enter 6-digit OTP",
            name: "otp",
        },
        {
            label: "New Password",
            type: showPassword ? "text" : "password",
            placeholder: "Enter new password",
            name: "newPassword",
            showPassword: true,
            onTogglePassword: () => setShowPassword(!showPassword),
        },
        {
            label: "Confirm Password",
            type: showConfirmPassword ? "text" : "password",
            placeholder: "Re-enter new password",
            name: "confirmPassword",
            showPassword: true,
            onTogglePassword: () =>
                setShowConfirmPassword(!showConfirmPassword),
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Reset Password
                </h2>
                <p className="text-gray-600 text-sm mb-6 text-center">
                    Enter the OTP sent to your email and your new password
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
                    {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
