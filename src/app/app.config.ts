import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import {
  authInterceptor,
  errorInterceptor,
  loadingInterceptor
} from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Router with component input binding for route params
    provideRouter(routes, withComponentInputBinding()),

    // HTTP Client with interceptors (order matters!)
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,   // First: manage loading state
        authInterceptor,      // Second: add auth header
        errorInterceptor,     // Third: handle errors
      ])
    ),
  ],
};
