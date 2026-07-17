export interface Permission {
  code: string;
  description?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  branchId?: string;
  roles: string[];
  permissions: string[];
}

export interface UserSession {
  authenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}
