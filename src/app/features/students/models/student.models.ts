export type StudentLevel = 'UNASSIGNED' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type StudentStatus = 'ACTIVO' | 'INACTIVO' | 'PRUEBA' | 'CONGELADO' | 'BAJA' | 'RESTRINGIDO';

export interface GuardianRequest {
  firstName: string;
  lastName?: string | null;
  phone: string;
  email?: string | null;
  relationship: string;
}

export interface EmergencyContactRequest {
  name: string;
  phone: string;
  relationship: string;
}

export interface GuardianResponse {
  firstName: string;
  lastName: string | null;
  phone: string;
  email: string | null;
  relationship: string;
}

export interface EmergencyContactResponse {
  name: string;
  phone: string;
  relationship: string;
}

export interface StudentSummaryResponse {
  id: string;
  photoFileId: string | null;
  fullName: string;
  phone: string;
  age: number;
  ageCategory: string;
  level: StudentLevel;
  status: StudentStatus;
}

export interface StudentResponse {
  id: string;
  branchId: string;
  photoFileId: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  birthDate: string;
  age: number;
  ageCategory: string;
  level: StudentLevel;
  status: StudentStatus;
  personalGoal: string | null;
  guardian: GuardianResponse | null;
  emergencyContact: EmergencyContactResponse | null;
}

export interface StudentUpdateRequest {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  personalGoal?: string | null;
  level: StudentLevel;
  guardian?: GuardianRequest | null;
  emergencyContact?: EmergencyContactRequest | null;
}

export interface StudentCreateRequest extends StudentUpdateRequest {
  branchId?: string | null;
}

export interface StudentSearchParams {
  page: number;
  size: number;
  /** Filtro local hasta que StudentSearchQuery backend lo soporte. */
  search?: string;
  /** Filtro local hasta que StudentSearchQuery backend lo soporte. */
  level?: StudentLevel | '';
  /** TODO backend: el endpoint actual no acepta sort. */
  sort?: string;
}
