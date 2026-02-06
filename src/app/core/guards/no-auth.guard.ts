import { inject } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * NoAuthGuard - Prevents authenticated users from accessing public-only routes
 * 
 * Usage: canActivate: [noAuthGuard]
 * 
 * Behavior:
 * - If user is NOT authenticated → allows access (login/register pages)
 * - If user IS authenticated → redirects to appropriate dashboard
 * 
 * Typically used for:
 * - /auth/login
 * - /auth/register
 */
export const noAuthGuard: CanActivateFn = (): boolean | UrlTree => {
    const authService = inject(AuthService);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // User is already authenticated, navigate to their dashboard
    authService.navigateToRoleBasedDashboard();
    return false;
};
