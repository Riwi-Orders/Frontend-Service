import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * RoleGuard Factory - Creates a guard that checks for specific roles
 * 
 * Usage: 
 *   canActivate: [roleGuard([UserRole.ADMIN])]
 *   canActivate: [roleGuard([UserRole.USER, UserRole.ADMIN])]
 * 
 * Behavior:
 * - If user has required role → allows access
 * - If user does NOT have role → redirects to unauthorized page or home
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
    return (): boolean | UrlTree => {
        const authService = inject(AuthService);
        const router = inject(Router);

        // First check if authenticated
        if (!authService.isAuthenticated()) {
            return router.createUrlTree(['/auth/login']);
        }

        // Then check if user has required role
        if (authService.hasAnyRole(allowedRoles)) {
            return true;
        }

        // User is authenticated but doesn't have required role
        // Redirect to appropriate page based on their actual role
        if (authService.isAdmin()) {
            return router.createUrlTree(['/admin/dashboard']);
        }

        return router.createUrlTree(['/products']);
    };
};

/**
 * Shorthand for admin-only routes
 * 
 * Usage: canActivate: [adminGuard]
 */
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);

/**
 * Shorthand for user-only routes (non-admin users)
 * 
 * Usage: canActivate: [userGuard]
 */
export const userGuard: CanActivateFn = roleGuard([UserRole.USER]);
