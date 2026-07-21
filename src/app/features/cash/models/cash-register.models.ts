export interface OpenCashRegisterRequest {
  branchId?: string;
  initialCash: number;
  currency: string;
}

export interface CloseCashRegisterRequest {
  countedCash: number;
  currency: string;
  notes?: string | null;
}

export interface CashRegisterSnapshot {
  id: string;
  branchId: string;
  branchName?: string | null;
  openedBy: string;
  openedByName?: string | null;
  openedAt: string;
  closedBy: string | null;
  closedByName?: string | null;
  closedAt: string | null;
  initialCash: number;
  expectedCash: number;
  countedCash: number | null;
  difference: number | null;
  currency: string;
  status: string;
  notes: string | null;
}
