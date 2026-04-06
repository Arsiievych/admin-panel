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
    const requestWithAuth = shouldAttachToken(request, accessToken)
        ? addAuthorizationHeader(request, accessToken)
        : request;

    return next(requestWithAuth).pipe(
        catchError((error: unknown) => {
            if (!shouldRefreshToken(error, request, accessToken)) {
                return throwError(() => error);
            }

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

            return refreshRequest$.pipe(
                switchMap(() => {
                    const refreshedToken = authService.getAccessToken();

                    if (!refreshedToken) {
                        logoutAndRedirect(authService, router);
                        return throwError(() => error);
                    }

                    return next(addAuthorizationHeader(request, refreshedToken));
                }),
            );
        }),
    );
};

function shouldAttachToken(request: HttpRequest<unknown>, accessToken: string | null): accessToken is string {
    return !!accessToken && !isLoginRequest(request);
}

function shouldRefreshToken(
    error: unknown,
    request: HttpRequest<unknown>,
    accessToken: string | null,
): boolean {
    return error instanceof HttpErrorResponse
        && error.status === 401
        && !!accessToken
        && !isAuthRequest(request);
}

function addAuthorizationHeader(request: HttpRequest<unknown>, accessToken: string): HttpRequest<unknown> {
    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

function isAuthRequest(request: HttpRequest<unknown>): boolean {
    return isLoginRequest(request) || request.url.includes('/auth/refresh');
}

function isLoginRequest(request: HttpRequest<unknown>): boolean {
    return request.url.includes('/auth/login');
}

function logoutAndRedirect(authService: AuthService, router: Router): void {
    authService.logout();
    void router.navigate(['/login']);
}
