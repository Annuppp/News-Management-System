import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Home, LayoutDashboard, LogOut, Plus, Menu, X } from "lucide-react";
import api from "../services/api";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await api.get("/user/logout");
        } catch {
            // Server session might already be expired
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav
            ref={menuRef}
            className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 text-gray-800 transition-all duration-200"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Logo */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2.5 cursor-pointer group select-none"
                    >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-sm sm:text-base shadow-xs shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
                            N
                        </div>
                        <span className="font-extrabold text-lg tracking-tight text-gray-900">
                            News<span className="text-sky-500">App</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/"
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                location.pathname === "/"
                                    ? "bg-sky-50 text-sky-600 font-semibold"
                                    : "text-gray-600 hover:text-sky-600 hover:bg-sky-50/50"
                            }`}
                        >
                            <Home size={17} />
                            <span>Home</span>
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                        location.pathname === "/dashboard"
                                            ? "bg-sky-50 text-sky-600 font-semibold"
                                            : "text-gray-600 hover:text-sky-600 hover:bg-sky-50/50"
                                    }`}
                                >
                                    <LayoutDashboard size={17} />
                                    <span>Dashboard</span>
                                </Link>

                                <Link
                                    to="/create-news"
                                    className="bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2 rounded-xl font-medium text-sm transition-all shadow-xs shadow-sky-500/25 inline-flex items-center gap-1.5 ml-1"
                                >
                                    <Plus size={16} />
                                    <span>Create News</span>
                                </Link>

                                {/* User Profile & Logout */}
                                <div className="flex items-center gap-3 pl-3 ml-2 border-l border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-semibold flex items-center justify-center text-xs border border-sky-200">
                                            {user.username
                                                ?.charAt(0)
                                                .toUpperCase() || "U"}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-700 max-w-[110px] truncate hidden lg:inline-block">
                                            {user.username}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                                        title="Sign out"
                                    >
                                        <LogOut size={14} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-sky-600 text-sm font-medium px-3.5 py-2 rounded-xl hover:bg-sky-50/50 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-xs shadow-sky-500/25 transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Panel */}
            {menuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-4 py-3 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                            location.pathname === "/"
                                ? "bg-sky-50 text-sky-600 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <Home size={18} />
                        Home
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                onClick={closeMenu}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                                    location.pathname === "/dashboard"
                                        ? "bg-sky-50 text-sky-600 font-semibold"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>

                            <Link
                                to="/create-news"
                                onClick={closeMenu}
                                className="bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-xs"
                            >
                                <Plus size={18} />
                                Create News
                            </Link>

                            <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-semibold flex items-center justify-center text-xs border border-sky-200">
                                        {user.username
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">
                                        {user.username}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        closeMenu();
                                        handleLogout();
                                    }}
                                    className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                                >
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="text-center py-2 text-sm font-medium text-gray-700 hover:text-sky-600"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={closeMenu}
                                className="text-center py-2 text-sm font-medium bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-xs"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
