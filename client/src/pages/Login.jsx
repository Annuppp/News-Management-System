import { useState } from "react";
import api from "../services/api";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

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

                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter you email"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white p-3 rounded font-medium hover:bg-sky-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
