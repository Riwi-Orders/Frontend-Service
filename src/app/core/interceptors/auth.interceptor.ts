import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * AuthInterceptor - Adds JWT token to all outgoing HTTP requests
 * 
 * Behavior:
 * 1. Reads token from AuthService
 * 2. Clones the request with Authorization header
 * 3. Forwards the modified request
 * 
 * Skips token injection for:
 * - Requests that already have Authorization header
 * - External API calls (optional, based on URL pattern)
 */
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // Skip if no token or if authorization header already exists
    if (!token || req.headers.has('Authorization')) {
        return next(req);
    }

    // Skip external URLs (only add token to our API)
    if (req.url.startsWith('http') && !req.url.includes('/api/')) {
        return next(req);
    }

    // Clone request and add authorization header
    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(authReq);
};
