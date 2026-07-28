import axios from "axios";

const api = axios.create({
    baseURL: "/",
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

// Add token interceptor to automatically include access token in requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default api;
