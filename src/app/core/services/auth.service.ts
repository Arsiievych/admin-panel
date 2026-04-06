import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs';
import {
    AuthSession,
    LoginRequest,
    LoginResponse,
    RefreshResponse,
} from '../models/auth.models';
import { ApiService } from './api.service';

type RefreshTokenData = Pick<AuthSession, 'accessToken' | 'tokenType' | 'expiresIn' | 'expiresAt'>;

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

    private readSession(): AuthSession | null {
        const rawSession = localStorage.getItem(this.storageKey);

        if (!rawSession) {
            return null;
        }

        try {
            return JSON.parse(rawSession) as AuthSession;
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
            profile: data.profile,
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
}
