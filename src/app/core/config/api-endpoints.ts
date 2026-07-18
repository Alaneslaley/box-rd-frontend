/** Paths relativos centralizados; AppConfig agrega el prefijo /api/v1. */
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  students: '/students',
  plans: '/plans',
  memberships: '/memberships',
  payments: '/payments',
  cashRegister: '/cash-register',
  attendance: '/attendance',
  instructor: '/instructor',
  media: '/media',
  reports: {
    adminDashboard: '/reports/admin/dashboard',
  },
} as const;
