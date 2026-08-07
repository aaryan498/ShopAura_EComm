import { IRootState, useAppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { AuthService } from "@/services/api/auth.service";
import { LoginCredentials } from "@/types/auth.types";
import { setUser } from "@/slices/authSlice";



export function useAuth(){
    const authState = useSelector((state: IRootState)=> state.auth)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();


    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try{

            const response = await AuthService.login(credentials);
            dispatch(
                setUser({
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                    user: response.user,
                })
            )
            // dispatch(updateUserAction(response));
            return true;

        } catch(error) {
            const errorMessage = error instanceof Error ? error.message : "Login Failed";
            setError(errorMessage);
            return false;

        } finally {
            setIsLoading(false);
        }

    }

    const logout = async() => {
        setIsLoading(true);
        setError(null);
        try {
            await AuthService.logout();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Log out failed";
            setError(errorMessage);
        } finally{
            setIsLoading(false);
        }
    }

    return {
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading,
        error,
        logout,
        login,
    }
    
}