import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
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
