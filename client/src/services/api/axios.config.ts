import axios from "axios";
import { store } from "@/store";
import { clearAuth, setAccessToken } from "@/slices/authSlice";


export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    // withCredentials: true,   used only when you use cookies for authentication
    timeout: 10000,
})

export const authClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            const state = store.getState();
            const refreshToken = state.auth.refreshToken;

            if (refreshToken) {

                try {

                    const response = await authClient.post<{ accessToken: string }>(
                        "/auth/refresh-token",
                        { refreshToken }
                    );

                    const newAccessToken = response.data.accessToken;

                    if (newAccessToken) {
                        store.dispatch(setAccessToken(newAccessToken));
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return apiClient(originalRequest);
                    }


                } catch (refreshError) {
                    store.dispatch(clearAuth());
                    if (typeof window !== "undefined") {
                        window.location.href = '/auth/login';
                    }
                    return Promise.reject(refreshError);
                }

            }
            store.dispatch(clearAuth());
            if (typeof window !== "undefined") {
                window.location.href = '/auth/login';
            }
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
)