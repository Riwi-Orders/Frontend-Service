/**
 * User role enumeration
 */
export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

/**
 * User model interface
 */
export interface User {
    id: string | number;
    name: string;
    email: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
    sub: string | number;
    email: string;
    role: UserRole;
    name?: string;
    iat: number;
    exp: number;
}

/**
 * Login request DTO
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Register request DTO
 */
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

/**
 * Authentication response from backend (inside ApiResponse.data)
 */
export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    userId: string;
    email: string;
    name: string;
    role: UserRole;
}

/**
 * Generic API response wrapper from backend
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}
