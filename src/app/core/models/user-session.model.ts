export interface Permission {
  code: string;
  description?: string;
}

export interface AuthUser {
  id: string;
  branchId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | string;
  mustChangePassword: boolean;
  authzVersion: number;
  roles: string[];
  permissions: string[];
}

export interface AuthSession {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  expiresAt?: number | null;
}

/** Alias de compatibilidad para los consumidores creados en Sprint 0. */
export type UserSession = AuthSession;

/** Respuesta directa de GET /auth/me (UserSnapshot del backend). */
export type AuthMeResponse = AuthUser;
