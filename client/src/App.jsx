import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOtp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import CreateNews from "./pages/CreateNews.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import EditNews from "./pages/EditNews.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-news" element={<CreateNews />} />
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/news/edit/:id" element={<EditNews />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
