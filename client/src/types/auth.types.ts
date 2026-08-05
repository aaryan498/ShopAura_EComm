
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