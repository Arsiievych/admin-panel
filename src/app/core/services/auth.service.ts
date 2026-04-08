import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs';
import {
    AdminProfileUpdateRequest,
    AuthSession,
    LoginRequest,
    LoginResponse,
    RefreshResponse,
    UserRole,
    UserProfile,
    UserProfileResponse,
} from '../models/auth.models';
import { ApiService } from './api.service';

type RefreshTokenData = Pick<AuthSession, 'accessToken' | 'tokenType' | 'expiresIn' | 'expiresAt'>;
const ADMIN_PANEL_ROLES: readonly UserRole[] = ['SUPER_ADMIN', 'MODERATOR', 'ADMIN'];

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly api = inject(ApiService);
    private readonly storageKey = 'admin_auth_session';

    private readonly sessionSignal = signal<AuthSession | null>(this.readSession());

    readonly session = computed(() => this.sessionSignal());
    readonly profile = computed(() => this.sessionSignal()?.profile ?? null);
    readonly isAuthenticated = computed(() => {
        const session = this.sessionSignal();

        return !!session?.accessToken && !this.isSessionExpired(session);
    });
    readonly hasAdminAccess = computed(() => {
        const profile = this.profile();

        return !!profile && ADMIN_PANEL_ROLES.includes(profile.role);
    });

    login(payload: LoginRequest) {
        return this.api.post<LoginResponse>('auth/login', payload).pipe(
            map((response) => this.mapLoginResponse(response)),
            tap((session) => this.setSession(session)),
        );
    }

    refresh() {
        return this.api.post<RefreshResponse>('auth/refresh', {}).pipe(
            map((response) => this.mapRefreshResponse(response)),
            tap((tokenData) => this.updateSessionTokens(tokenData)),
        );
    }

    getCurrentProfile() {
        return this.api.get<UserProfileResponse>('auth/me').pipe(
            map((response) => response.data),
            tap((profile) => this.updateSessionProfile(profile)),
        );
    }

    updateProfile(payload: AdminProfileUpdateRequest) {
        return this.api.put<UserProfileResponse>('auth/profile', payload).pipe(
            map((response) => response.data),
            tap((profile) => this.updateSessionProfile(profile)),
        );
    }

    logout() {
        return this.api.post('auth/logout', {}).pipe(
            finalize(() => this.clearSession()),
        );
    }

    clearSession(): void {
        localStorage.removeItem(this.storageKey);
        this.sessionSignal.set(null);
    }

    getAccessToken(): string | null {
        return this.sessionSignal()?.accessToken ?? null;
    }

    canAccessAdminPanel(): boolean {
        return this.isAuthenticated() && this.hasAdminAccess();
    }

    isTokenExpired(): boolean {
        const session = this.sessionSignal();

        return !session || this.isSessionExpired(session);
    }

    private setSession(session: AuthSession): void {
        localStorage.setItem(this.storageKey, JSON.stringify(session));
        this.sessionSignal.set(session);
    }

    private updateSessionTokens(tokenData: RefreshTokenData): void {
        const currentSession = this.sessionSignal();

        if (!currentSession) {
            return;
        }

        const nextSession: AuthSession = {
            ...currentSession,
            ...tokenData,
        };

        this.setSession(nextSession);
    }

    private updateSessionProfile(profile: UserProfile): void {
        const currentSession = this.sessionSignal();

        if (!currentSession) {
            return;
        }

        this.setSession({
            ...currentSession,
            profile: this.normalizeProfile(profile),
        });
    }

    private readSession(): AuthSession | null {
        const rawSession = localStorage.getItem(this.storageKey);

        if (!rawSession) {
            return null;
        }

        try {
            const session = JSON.parse(rawSession) as AuthSession;

            return {
                ...session,
                profile: this.normalizeProfile(session.profile),
            };
        } catch {
            localStorage.removeItem(this.storageKey);

            return null;
        }
    }

    private mapLoginResponse(response: LoginResponse): AuthSession {
        const data = response.data;

        return {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            expiresAt: this.getExpiresAt(data.expires_in),
            profile: this.normalizeProfile(data.profile),
        };
    }

    private mapRefreshResponse(response: RefreshResponse): RefreshTokenData {
        const data = response.data;

        return {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            expiresAt: this.getExpiresAt(data.expires_in),
        };
    }

    private getExpiresAt(expiresInSeconds: number): number {
        return Date.now() + expiresInSeconds * 1000;
    }

    private isSessionExpired(session: AuthSession): boolean {
        return Date.now() >= session.expiresAt;
    }

    private normalizeProfile(profile: UserProfile): UserProfile {
        return {
            ...profile,
            role: this.normalizeRole(profile.role),
        };
    }

    private normalizeRole(role: unknown): UserRole {
        switch (role) {
            case 1:
            case '1':
                return 'USER';
            case 2:
            case '2':
                return 'MODERATOR';
            case 3:
            case '3':
                return 'ADMIN';
            case 4:
            case '4':
                return 'SUPER_ADMIN';
            default:
                return typeof role === 'string' ? role.trim().toUpperCase() : 'USER';
        }
    }
}
