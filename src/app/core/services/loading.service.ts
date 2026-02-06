import { Injectable, signal, computed } from '@angular/core';

/**
 * LoadingService - Centralized loading state management
 * 
 * Uses Angular signals for reactive state updates
 * Tracks multiple concurrent loading operations
 */
@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private readonly loadingCountSignal = signal<number>(0);

    /** True when any loading operation is in progress */
    readonly isLoading = computed(() => this.loadingCountSignal() > 0);

    /** Current number of concurrent loading operations */
    readonly loadingCount = this.loadingCountSignal.asReadonly();

    /**
     * Start a loading operation
     */
    startLoading(): void {
        this.loadingCountSignal.update((count) => count + 1);
    }

    /**
     * End a loading operation
     */
    stopLoading(): void {
        this.loadingCountSignal.update((count) => Math.max(0, count - 1));
    }

    /**
     * Reset all loading state
     */
    resetLoading(): void {
        this.loadingCountSignal.set(0);
    }
}
