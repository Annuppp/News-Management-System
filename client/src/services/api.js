import axios from "axios";

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Helper to convert backend file paths into working absolute URLs
export const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    // Normalize Windows backslashes and strip prefix
    const normalized = imagePath.replace(/\\/g, "/");
    const cleanPath = normalized.startsWith("src/uploads/")
        ? normalized.replace("src/uploads/", "uploads/")
        : normalized;
    const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${API_BASE_URL}${finalPath}`;
};

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

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401, not already retried, and not the rotation route itself
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/user/rotateTokens")
        ) {
            originalRequest._retry = true;

            try {
                const storedRefreshToken = localStorage.getItem("refreshToken");
                const res = await axios.post(
                    `${API_BASE_URL}/user/rotateTokens`,
                    { refreshToken: storedRefreshToken || undefined },
                    { withCredentials: true },
                );

                if (res.data?.accessToken) {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    if (res.data.refreshToken) {
                        localStorage.setItem(
                            "refreshToken",
                            res.data.refreshToken,
                        );
                    }
                    if (res.data.user) {
                        localStorage.setItem(
                            "user",
                            JSON.stringify(res.data.user),
                        );
                    }

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    },
);

export default api;
