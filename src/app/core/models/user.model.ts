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
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
    accessToken: string;
    user?: User;
}
