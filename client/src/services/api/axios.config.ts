import axios from "axios";
import { config } from "process";
import { SiAxios } from "react-icons/si";
import { AuthService } from "./auth.service";
import { store } from "@/store";
import { clearAuth, setAccessToken } from "@/slices/authSlice";


export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    // withCredentials: true,   used only when you use cookies for authentication
    timeout: 10000,
})

apiClient.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if(token){
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
    async(error) => {
        const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            const state = store.getState();
            const refreshToken = state.auth.refreshToken;

            if(refreshToken){
                const newAccessToken = await AuthService.refreshToken(refreshToken);
                if(newAccessToken){
                    store.dispatch(setAccessToken(newAccessToken));
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                }

            }
            store.dispatch(clearAuth());
            if(typeof window == undefined){
                window.location.href = 'auth/login';
            }
        }
        return Promise.reject(error);
    }
)