export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface LoginResponse {
    data: LoginData;
}

export interface LoginRequest{
    email: string;
    password: string;
}

export interface LoginData{
    accessToken: string;
    token_type: 'bearer' | string;
    expires_in: number;
    user: User;
}

export interface RefreshResponse {
    data: RefreshData;
}

export interface RefreshData {
    access_token: string;
    token_type: 'bearer' | string;
    expires_in: number;
}

export interface AuthSession {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    expiresAt: number;
    profile: UserProfile | null;
}

export interface UserProfile {
    id: number;
    nickname: string;
    email: string;
    email_verified: boolean;
    role: number;
    status: string;
    language: string;
}
