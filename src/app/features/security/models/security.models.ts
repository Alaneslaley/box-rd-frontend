export type UserStatus = 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';

export interface CreateUserRequest {
  branchId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  roles: string[];
}

export interface UserSnapshot {
  id: string;
  branchId: string;
  branchName?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus | string;
  mustChangePassword: boolean;
  authzVersion: number;
  roles: string[];
  permissions: string[];
}

export interface StatusRequest { status: UserStatus; }
export interface RolesRequest { roles: string[]; }

export interface RoleSnapshot {
  id: string;
  code: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface UsersSearchParams { page: number; size: number; }
