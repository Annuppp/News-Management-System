import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-slate-800 text-white p-4 shadow-lg flex justify-between items-center">
            <h2 className="font-bold text-lg">📰 NewsApp</h2>
            <div className="flex gap-6">
                <Link to="/" className="hover:text-sky-400 transition">
                    Home
                </Link>
                <Link to="login" className="hover:text-sky-400">
                    Login
                </Link>
                <Link to="/register" className="hover:text-sky-400">
                    Register
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
