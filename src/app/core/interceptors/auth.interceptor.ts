import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let refreshRequest$: Observable<unknown> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const accessToken = authService.getAccessToken();
    const sendRequest = (token: string | null) => next(attachAuthorizationHeader(request, token));

    if (shouldRefreshBeforeRequest(request, authService)) {
        return getRefreshRequest(authService, router).pipe(
            switchMap(() => sendRequest(authService.getAccessToken())),
        );
    }

    return sendRequest(accessToken).pipe(
        catchError((error: unknown) => {
            const latestAccessToken = authService.getAccessToken();

            if (!shouldRetryWithRefresh(error, request, latestAccessToken)) {
                return throwError(() => error);
            }

            return getRefreshRequest(authService, router).pipe(
                switchMap(() => {
                    const refreshedToken = authService.getAccessToken();

                    if (!refreshedToken) {
                        logoutAndRedirect(authService, router);
                        return throwError(() => error);
                    }

                    return sendRequest(refreshedToken);
                }),
            );
        }),
    );
};

function shouldAttachToken(request: HttpRequest<unknown>, accessToken: string | null): accessToken is string {
    return !!accessToken && !isTokenlessAuthRequest(request);
}

function shouldRetryWithRefresh(
    error: unknown,
    request: HttpRequest<unknown>,
    accessToken: string | null,
): boolean {
    return error instanceof HttpErrorResponse
        && error.status === 401
        && !!accessToken
        && !isAuthRequest(request);
}

function attachAuthorizationHeader(request: HttpRequest<unknown>, accessToken: string | null): HttpRequest<unknown> {
    if (!shouldAttachToken(request, accessToken)) {
        return request;
    }

    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

function shouldRefreshBeforeRequest(request: HttpRequest<unknown>, authService: AuthService): boolean {
    return authService.shouldRefreshToken() && !isAuthRequest(request);
}

function isAuthRequest(request: HttpRequest<unknown>): boolean {
    return isTokenlessAuthRequest(request) || request.url.includes('/auth/logout');
}

function isTokenlessAuthRequest(request: HttpRequest<unknown>): boolean {
    return request.url.includes('/auth/login') || request.url.includes('/auth/refresh');
}

function getRefreshRequest(authService: AuthService, router: Router): Observable<unknown> {
    refreshRequest$ ??= authService.refresh().pipe(
        catchError((refreshError: unknown) => {
            logoutAndRedirect(authService, router);
            return throwError(() => refreshError);
        }),
        finalize(() => {
            refreshRequest$ = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
    );

    return refreshRequest$;
}

function logoutAndRedirect(authService: AuthService, router: Router): void {
    authService.clearSession();
    void router.navigate(['/login']);
}
