export interface IncomeTotalResponse {
  currency: string;
  amount: number;
}

export interface IncomeByMethodResponse {
  method: string;
  currency: string;
  payments: number;
  amount: number;
}

export interface AdminDashboardResponse {
  businessDate: string;
  branchId: string;
  activeStudents: number;
  expiredMemberships: number;
  paymentsToday: number;
  attendanceToday: number;
  incomeToday: IncomeTotalResponse[];
  incomeByMethod: IncomeByMethodResponse[];
}
