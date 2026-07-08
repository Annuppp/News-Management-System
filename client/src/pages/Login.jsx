import { useState } from "react";
import api from "../services/api";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const fields = [
        {
            label: "Email",
            type: "email",
            placeholder: "Enter your email",
            name: "email",
        },
        {
            label: "Password",
            type: showPassword ? "text" : "password",
            placeholder: "Enter your password",
            name: "password",
            showPassword: true,
            onTogglePassword: () => setShowPassword(!showPassword),
        },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await api.post("/user/login", form);

            // added the lines here
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/"); // will have to remove these lines when email part is done

            // console.log(res.data);
            // alert("Login Successful");
        } catch (err) {
            setErrors({
                server:
                    err.response?.data?.message ||
                    "Login failed. Please check your credentials.",
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
                    Login
                </h2>

                {fields.map((field) => (
                    <InputField
                        key={field.name}
                        {...field}
                        value={form[field.name]}
                        onChange={handleChange}
                        error={errors[field.name]}
                    />
                ))}

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={form.rememberMe}
                            onChange={handleChange}
                            className="w-4 h-4 text-sky-400 border-gray-300 rounded focus:ring-sky-500"
                        />
                        <label
                            htmlFor="rememberMe"
                            className="ml-2 text-sm text-gray-600"
                        >
                            Remember me
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sky-500 hover:text-sky-600 text-sm"
                    >
                        Forgot Password?
                    </button>
                </div>

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
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
