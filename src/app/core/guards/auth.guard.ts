import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.canAccessAdminPanel()) {
        return true;
    }

    if (authService.isAuthenticated() && !authService.hasAdminAccess()) {
        authService.clearSession();
        return router.createUrlTree(['/login']);
    }

    if (!authService.hasSession() || !authService.hasAdminAccess()) {
        authService.clearSession();
        return router.createUrlTree(['/login']);
    }

    return authService.refresh().pipe(
        map(() => authService.canAccessAdminPanel() ? true : logoutAndRedirect(authService, router)),
        catchError(() => {
            authService.clearSession();
            return of(router.createUrlTree(['/login']));
        }),
    );
};

function logoutAndRedirect(authService: AuthService, router: Router) {
    authService.clearSession();
    return router.createUrlTree(['/login']);
}
