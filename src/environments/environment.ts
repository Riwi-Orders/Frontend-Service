/**
 * Development environment configuration
 */
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api',

    // Feature flags
    enableDebug: true,

    // Token configuration
    tokenKey: 'access_token',
    tokenExpiration: 3600, // seconds
};
