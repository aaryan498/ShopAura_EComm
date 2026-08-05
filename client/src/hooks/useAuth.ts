import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { authService } from "@/services/api/auth.service";



export function useAuth(){
    const authState = useSelector((state: IRootState)=> state.auth)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const logout = async() => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.logout();
        } catch (error) {
            
        }
    }

    return {
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading,
        error,
        logout,
    }
    
}