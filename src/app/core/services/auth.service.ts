import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';
import {
    User,
    UserRole,
    JwtPayload,
    LoginRequest,
    RegisterRequest,
    AuthResponse
} from '../models/user.model';

/**
 * AuthService - Handles all authentication-related operations
 * 
 * Responsibilities:
 * - Login/Logout operations
 * - Token management (storage, retrieval, validation)
 * - User state management with Angular signals
 * - Role-based access control helpers
 */
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly API_URL = '/api/auth';
    private readonly TOKEN_KEY = 'access_token';

    // Reactive state with Angular signals
    private readonly currentUserSignal = signal<User | null>(null);
    private readonly isLoadingSignal = signal<boolean>(false);

    // Public readonly computed signals
    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isLoading = this.isLoadingSignal.asReadonly();
    readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
    readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);
    readonly isAdmin = computed(() => this.currentUserSignal()?.role === UserRole.ADMIN);

    constructor() {
        this.initializeAuthState();
    }

    /**
     * Initialize authentication state from stored token on app startup
     */
    private initializeAuthState(): void {
        const token = this.getToken();
        if (token && !this.isTokenExpired(token)) {
            const payload = this.decodeToken(token);
            if (payload) {
                this.currentUserSignal.set(this.extractUserFromPayload(payload));
            }
        } else {
            this.clearAuthData();
        }
    }

    /**
     * Login with email and password
     */
    login(credentials: LoginRequest): Observable<AuthResponse> {
        this.isLoadingSignal.set(true);

        return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
            tap((response) => {
                this.handleAuthSuccess(response);
            }),
            catchError((error) => {
                this.isLoadingSignal.set(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Register a new user
     */
    register(userData: RegisterRequest): Observable<AuthResponse> {
        this.isLoadingSignal.set(true);

        return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
            tap((response) => {
                this.handleAuthSuccess(response);
            }),
            catchError((error) => {
                this.isLoadingSignal.set(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Logout the current user
     */
    logout(): void {
        this.clearAuthData();
        this.router.navigate(['/auth/login']);
    }

    /**
     * Get stored JWT token
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Check if user has a specific role
     */
    hasRole(role: UserRole): boolean {
        return this.currentUserSignal()?.role === role;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: UserRole[]): boolean {
        const currentRole = this.currentUserSignal()?.role;
        return currentRole ? roles.includes(currentRole) : false;
    }

    /**
     * Validate current authentication status
     */
    validateToken(): Observable<boolean> {
        const token = this.getToken();

        if (!token) {
            return of(false);
        }

        if (this.isTokenExpired(token)) {
            this.clearAuthData();
            return of(false);
        }

        return of(true);
    }

    /**
     * Handle successful authentication
     */
    private handleAuthSuccess(response: AuthResponse): void {
        this.storeToken(response.accessToken);

        const payload = this.decodeToken(response.accessToken);
        if (payload) {
            const user = response.user ?? this.extractUserFromPayload(payload);
            this.currentUserSignal.set(user);
        }

        this.isLoadingSignal.set(false);
    }

    /**
     * Store JWT token in localStorage
     */
    private storeToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Clear all authentication data
     */
    private clearAuthData(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.currentUserSignal.set(null);
        this.isLoadingSignal.set(false);
    }

    /**
     * Decode JWT token to extract payload
     */
    private decodeToken(token: string): JwtPayload | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            const payload = parts[1];
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decoded) as JwtPayload;
        } catch {
            return null;
        }
    }

    /**
     * Check if JWT token is expired
     */
    private isTokenExpired(token: string): boolean {
        const payload = this.decodeToken(token);
        if (!payload) {
            return true;
        }

        const expirationDate = new Date(payload.exp * 1000);
        return expirationDate <= new Date();
    }

    /**
     * Extract user information from JWT payload
     */
    private extractUserFromPayload(payload: JwtPayload): User {
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name ?? payload.email.split('@')[0],
            role: payload.role,
        };
    }

    /**
     * Navigate user to appropriate dashboard based on role
     */
    navigateToRoleBasedDashboard(): void {
        const role = this.currentUserSignal()?.role;

        if (role === UserRole.ADMIN) {
            this.router.navigate(['/admin/dashboard']);
        } else {
            this.router.navigate(['/products']);
        }
    }
}
