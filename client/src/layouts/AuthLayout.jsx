import { Outlet, Link, Navigate, useLocation } from "react-router-dom";

export default function AuthLayout() {
    const token = localStorage.getItem("accessToken");
    const location = useLocation();

    // If already logged in and visiting login or register, redirect to home
    if (token && (location.pathname === "/login" || location.pathname === "/register")) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <nav className="bg-slate-800 text-white p-4 shadow-lg">
                <Link
                    to="/"
                    className="font-bold text-lg hover:text-sky-400 transition"
                >
                    📰 NewsApp
                </Link>
            </nav>
            <Outlet />
        </div>
    );
}
