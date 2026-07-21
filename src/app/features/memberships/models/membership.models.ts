import { PlanType } from '../../plans/models/plan.models';

export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'FROZEN' | 'CANCELLED';

export interface MembershipSnapshot {
  id: string;
  branchId: string;
  branchName?: string | null;
  studentId: string;
  studentName?: string | null;
  planId: string;
  planName: string;
  planType: PlanType;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  includedClasses: number | null;
  remainingClasses: number | null;
}

export interface CreateMembershipRequest { studentId: string; planId: string; startDate: string; }
export interface RenewMembershipRequest { effectiveOn: string; }
export interface MembershipSearchParams { page: number; size: number; }
