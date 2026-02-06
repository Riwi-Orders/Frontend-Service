/**
 * Production environment configuration
 */
export const environment = {
    production: true,
    apiUrl: '/api', // Use relative URL in production (behind proxy)

    // Feature flags
    enableDebug: false,

    // Token configuration
    tokenKey: 'access_token',
    tokenExpiration: 3600, // seconds
};
