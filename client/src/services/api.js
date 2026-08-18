import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: false,
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

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem("refreshToken");
                if (refreshToken) {
                    const res = await axios.post(
                        "http://localhost:3000/user/rotateTokens",
                        {
                            refreshToken,
                        },
                    );

                    if (res.data.accessToken) {
                        localStorage.setItem(
                            "accessToken",
                            res.data.accessToken,
                        );
                        localStorage.setItem(
                            "refreshToken",
                            res.data.refreshToken,
                        );

                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // Clear tokens and redirect to login
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;
