export interface LoginResponse {
    data: LoginData;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginData {
    access_token: string;
    token_type: 'bearer' | string;
    expires_in: number;
    profile: UserProfile;
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
    profile: UserProfile;
}

export interface UserProfileResponse {
    data: UserProfile;
}

export interface AdminProfileUpdateRequest {
    name?: string;
    email?: string;
    old_password?: string;
    new_password?: string;
    confirm_password?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'MODERATOR' | 'ADMIN' | 'USER' | string;

export interface UserProfile {
    id: number;
    nickname: string;
    email: string;
    email_verified: boolean;
    role: UserRole;
    status: string;
    language: string;
}
