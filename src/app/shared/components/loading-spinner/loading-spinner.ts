import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

/**
 * LoadingSpinnerComponent - Global loading overlay
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  template: `
    @if (isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm" 
           role="status" 
           aria-live="polite">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
            <div class="absolute inset-1 rounded-full border-4 border-transparent border-r-purple-500 animate-spin" style="animation-duration: 1.5s;"></div>
            <div class="absolute inset-2 rounded-full border-4 border-transparent border-b-pink-500 animate-spin" style="animation-duration: 2s;"></div>
          </div>
          <span class="text-sm font-medium text-slate-400 animate-pulse">Loading...</span>
        </div>
      </div>
    }
  `,
})
export class LoadingSpinner {
  private readonly loadingService = inject(LoadingService);

  readonly isLoading = this.loadingService.isLoading;
}
