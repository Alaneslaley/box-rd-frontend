import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { PageResponse } from '../../../core/models/page-response.model';
import { normalizePageRequest, normalizePageResponse } from '../../../core/models/page-response.util';
import { PaymentSearchParams, PaymentSnapshot, ReceiptSnapshot, RegisterPaymentRequest } from '../models/payment.models';

@Injectable({ providedIn: 'root' })
export class PaymentsApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.payments}`;

  list(params: PaymentSearchParams): Observable<PageResponse<PaymentSnapshot>> {
    const requested = normalizePageRequest(params);
    const httpParams = new HttpParams().set('page', requested.page).set('size', requested.size);
    return this.http.get<PageResponse<PaymentSnapshot>>(this.baseUrl, { params: httpParams })
      .pipe(map((page) => normalizePageResponse(page, requested)));
  }

  getById(id: string): Observable<PaymentSnapshot> { return this.http.get<PaymentSnapshot>(`${this.baseUrl}/${encodeURIComponent(id)}`); }

  register(request: RegisterPaymentRequest, idempotencyKey: string): Observable<PaymentSnapshot> {
    const headers = new HttpHeaders().set('Idempotency-Key', idempotencyKey);
    return this.http.post<PaymentSnapshot>(this.baseUrl, request, { headers });
  }

  getReceipt(paymentId: string): Observable<ReceiptSnapshot> { return this.http.get<ReceiptSnapshot>(`${this.baseUrl}/${encodeURIComponent(paymentId)}/receipt`); }
}
