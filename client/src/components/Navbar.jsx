import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Home, LayoutDashboard, LogOut, Plus, Menu, X } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
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

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
    }; // till here

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav
            ref={menuRef}
            className="bg-slate-800 text-white p-4 shadow-lg flex justify-between items-center relative"
        >
            <div
                onClick={() => navigate("/")}
                className="font-bold text-lg hover:text-sky-400 transition cursor-pointer"
            >
                📰 NewsApp
            </div>
            <div className="hidden md:flex gap-6 items-center">
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
            {/* mobile hamburger button */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition"
                aria-label="Toggle menu"
            >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/*dropdown menu */}
            {menuOpen && (
                <div className="absolute top-full left-0 right-0 bg-slate-800 border-t border-slate-700 shadow-lg md:hidden flex flex-col p-4 gap-3 z-50">
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="hover:text-sky-400 transition inline-flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-700"
                    >
                        <Home size={18} />
                        Home
                    </Link>
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                onClick={closeMenu}
                                className="hover:text-sky-400 transition inline-flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-700"
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                            <Link
                                to="/create-news"
                                onClick={closeMenu}
                                className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg transition inline-flex items-center gap-2 w-fit"
                            >
                                <Plus size={18} />
                                Create News
                            </Link>
                            <button
                                onClick={() => {
                                    closeMenu();
                                    handleLogout();
                                }}
                                className="border border-gray-600 hover:border-sky-400 hover:text-sky-400 px-3 py-2 rounded-lg transition inline-flex items-center gap-2 w-fit"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="hover:text-sky-400 px-2 py-2 rounded-lg hover:bg-slate-700"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={closeMenu}
                                className="hover:text-sky-400 px-2 py-2 rounded-lg hover:bg-slate-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
