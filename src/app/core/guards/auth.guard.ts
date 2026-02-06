import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard - Protects routes that require authentication
 * 
 * Usage: canActivate: [authGuard]
 * 
 * Behavior:
 * - If user is authenticated → allows access
 * - If user is NOT authenticated → redirects to login page
 */
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Store the attempted URL for redirecting after login (optional enhancement)
    // Could be injected into a session state if needed

    return router.createUrlTree(['/auth/login']);
};
