import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * LoadingInterceptor - Automatically manages loading state for HTTP requests
 * 
 * Behavior:
 * - Shows loading spinner when request starts
 * - Hides loading spinner when request completes (success or error)
 * - Supports multiple concurrent requests
 * 
 * Skip loading for specific requests by adding a custom header:
 * headers.set('X-Skip-Loading', 'true')
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Check if this request should skip loading indicator
    const skipLoading = req.headers.has('X-Skip-Loading');

    if (skipLoading) {
        // Remove the header before sending and skip loading
        const cleanReq = req.clone({
            headers: req.headers.delete('X-Skip-Loading'),
        });
        return next(cleanReq);
    }

    // Start loading
    loadingService.startLoading();

    return next(req).pipe(
        finalize(() => {
            // Stop loading regardless of success or error
            loadingService.stopLoading();
        })
    );
};
