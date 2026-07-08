import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
    // added these lines for email
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
    }; // till here

    return (
        <nav className="bg-slate-800 text-white p-4 shadow-lg flex justify-between items-center">
            <h2 className="font-bold text-lg">📰 NewsApp</h2>
            <div className="flex gap-6 items-center">
                <Link to="/" className="hover:text-sky-400 transition">
                    Home
                </Link>
                {user ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="hover:text-sky-400 transition"
                        >
                            Dashboard
                        </Link>
                        <span className="text-sm">Hello, {user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="hover:text-sky-400 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-sky-400">
                            Login
                        </Link>
                        <Link to="/register" className="hover:text-sky-400">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
