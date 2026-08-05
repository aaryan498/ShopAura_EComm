import { apiClient } from "./axios.config";

export const authService = {

    logout: async(): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.log("LogOut falied", error);
        }
    },
    refreshToken: async(refreshToken : string): Promise<string | null> => {
        if(!refreshToken) return null;
        try {
            const response = await apiClient.post<{ accessToken: string }>('/auth/refresh-token', {refreshToken});
            const { accessToken } = response.data;
            return accessToken;
        } catch (error) {
            console.log("Refresh Token Error", error);
            return null;
        }
    }
}