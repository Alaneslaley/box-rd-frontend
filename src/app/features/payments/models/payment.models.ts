export type PaymentMethod = 'CASH' | 'TRANSFER' | 'MANUAL_CARD';

export interface RegisterPaymentRequest {
  membershipId: string;
  method: PaymentMethod;
  effectiveOn: string;
}

export interface PaymentSnapshot {
  id: string;
  folio: string;
  branchId: string;
  branchName?: string | null;
  studentId: string;
  studentName?: string | null;
  membershipId: string;
  /** Es null para pagos que no requieren caja, según el backend actual. */
  cashRegisterId: string | null;
  amount: number;
  currency: string;
  method: PaymentMethod | string;
  concept: string;
  status: string;
  registeredAt: string;
}

export interface ReceiptSnapshot {
  id: string;
  paymentId: string;
  receiptNumber: string;
  paymentFolio: string;
  studentId: string;
  studentName?: string | null;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod | string;
  status: string;
  deliveryStatus: string;
  generatedAt: string;
}

export interface PaymentSearchParams { page: number; size: number; }
