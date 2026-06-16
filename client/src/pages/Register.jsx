import { useState } from "react";
import api from "../services/api";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/register", form);

            console.log(res.data);
            alert("Registered Successfully");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="username"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
                type="email"
                placeholder="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
                type="password"
                placeholder="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
