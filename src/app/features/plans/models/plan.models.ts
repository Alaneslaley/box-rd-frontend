export type PlanType = 'WEEKLY' | 'MONTHLY' | 'SINGLE_CLASS' | 'CLASS_PACKAGE';
export type PlanStatus = 'ACTIVO' | 'INACTIVO';

export interface PlanSnapshot {
  id: string;
  branchId: string;
  name: string;
  description: string | null;
  type: PlanType;
  price: number;
  currency: string;
  validityDays: number | null;
  includedClasses: number | null;
  status: PlanStatus;
}

export interface CreatePlanRequest {
  branchId?: string;
  name: string;
  description?: string | null;
  type: PlanType;
  price: number;
  currency: string;
  validityDays?: number | null;
  includedClasses?: number | null;
}

export interface UpdatePlanRequest {
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  validityDays?: number | null;
  includedClasses?: number | null;
  status: PlanStatus;
}

export interface PlanSearchParams {
  page: number;
  size: number;
  includeInactive: boolean;
}
