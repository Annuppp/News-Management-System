import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, LayoutDashboard, LogOut, Plus } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
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
            <div
                onClick={() => navigate("/")}
                className="font-bold text-lg hover:text-sky-400 transition cursor-pointer"
            >
                📰 NewsApp
            </div>

            <div className="flex gap-6 items-center">
                <Link
                    to="/"
                    className="hover:text-sky-400 transition flex items-center gap-2"
                >
                    <Home size={18} />
                    Home
                </Link>
                {user ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="hover:text-sky-400 transition flex items-center gap-2"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link
                            to="/create-news"
                            className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Create News
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="border border-gray-600 hover:border-sky-400 hover:text-sky-400 px-3 py-2 rounded-lg transition flex items-center gap-2"
                        >
                            <LogOut size={18} />
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
