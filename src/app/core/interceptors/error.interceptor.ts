import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Error codes with their meanings
 */
export enum HttpErrorCode {
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

/**
 * ErrorInterceptor - Centralized HTTP error handling
 * 
 * Behavior:
 * - 401 Unauthorized → Logout user and redirect to login
 * - 403 Forbidden → Redirect to "access denied" page
 * - 404 Not Found → Can show notification or redirect
 * - 500+ Server Error → Show server error notification
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred';

            switch (error.status) {
                case HttpErrorCode.UNAUTHORIZED:
                    // Token expired or invalid - force logout
                    if (authService.isAuthenticated()) {
                        authService.logout();
                    }
                    errorMessage = 'Your session has expired. Please log in again.';
                    break;

                case HttpErrorCode.FORBIDDEN:
                    // User doesn't have permission
                    errorMessage = 'You do not have permission to perform this action.';
                    // Optionally navigate to a forbidden page
                    // router.navigate(['/forbidden']);
                    break;

                case HttpErrorCode.NOT_FOUND:
                    errorMessage = 'The requested resource was not found.';
                    break;

                case HttpErrorCode.INTERNAL_SERVER_ERROR:
                case HttpErrorCode.SERVICE_UNAVAILABLE:
                    errorMessage = 'Server error. Please try again later.';
                    break;

                default:
                    if (error.error?.message) {
                        errorMessage = error.error.message;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }
            }

            // You can inject a notification service here to show toast messages
            console.error(`HTTP Error [${error.status}]:`, errorMessage);

            // Re-throw the error with the processed message
            return throwError(() => ({
                status: error.status,
                message: errorMessage,
                originalError: error,
            }));
        })
    );
};
