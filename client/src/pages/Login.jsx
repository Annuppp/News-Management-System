import { useState } from "react";
import api from "../services/api";
import InputField from "../components/InputField";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const fields = [
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
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/user/login", form);
            console.log(res.data);
            alert("Login Successful");
        } catch (err) {
            console.log(err);
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
                    />
                ))}

                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white p-3 rounded-lg font-medium hover:bg-sky-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
