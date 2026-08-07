
export interface AuthState {
    accessToken: string | null,
    refreshToken: string | null,
    user: User | null,
    isAuthenticated: boolean,
}


export interface User {
    id: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    email: string,
    role: string,
}


export interface LoginCredentials {
    email: string;
    password: string;
}


export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}