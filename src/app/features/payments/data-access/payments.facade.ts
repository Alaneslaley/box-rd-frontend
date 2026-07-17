import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { PaymentSearchParams, PaymentSnapshot, ReceiptSnapshot, RegisterPaymentRequest } from '../models/payment.models';
import { PaymentsApiService } from './payments-api.service';

const INITIAL_QUERY: PaymentSearchParams = { page: 0, size: 20 };

@Injectable({ providedIn: 'root' })
export class PaymentsFacade {
  private readonly api = inject(PaymentsApiService);
  private readonly pageState = signal<PageResponse<PaymentSnapshot> | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<ApiError | null>(null);
  private readonly queryState = signal<PaymentSearchParams>(INITIAL_QUERY);

  readonly page = this.pageState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadPayments(): void {
    this.loadingState.set(true); this.errorState.set(null);
    this.api.list(this.queryState()).subscribe({
      next: (page) => { this.pageState.set(page); this.loadingState.set(false); },
      error: (error: ApiError) => { this.errorState.set(error); this.loadingState.set(false); },
    });
  }

  changePage(page: number): void {
    if (page < 0 || page === this.queryState().page) return;
    this.queryState.update((current) => ({ ...current, page }));
    this.loadPayments();
  }

  loadPaymentDetail(id: string): Observable<PaymentSnapshot> { return this.api.getById(id); }
  registerPayment(request: RegisterPaymentRequest, idempotencyKey: string): Observable<PaymentSnapshot> { return this.api.register(request, idempotencyKey); }
  loadReceipt(paymentId: string): Observable<ReceiptSnapshot> { return this.api.getReceipt(paymentId); }
}
