/** Paths relativos centralizados; AppConfig agrega el prefijo /api/v1. */
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
} as const;
