import { useState } from "react";
import api from "../services/api";
import InputField from "../components/InputField";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

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
    ];

    // Single handler for ALL fields — uses name attribute
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/user/register", form);
            console.log(res.data);
            alert("Registered Successfully");
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
                    Register
                </h2>

                {/* One line renders all fields */}
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
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
