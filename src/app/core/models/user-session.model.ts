export interface Permission {
  code: string;
  description?: string;
}

export interface AuthUser {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
  username?: string;
  branchId?: string;
  roles: string[];
  permissions: string[];
  active?: boolean;
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

export interface AuthMeResponse {
  user: AuthUser;
  roles: string[];
  permissions: string[];
}
