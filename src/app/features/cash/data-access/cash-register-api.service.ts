import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { CashRegisterSnapshot, CloseCashRegisterRequest, OpenCashRegisterRequest } from '../models/cash-register.models';

@Injectable({ providedIn: 'root' })
export class CashRegisterApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.cashRegister}`;

  current(): Observable<CashRegisterSnapshot> { return this.http.get<CashRegisterSnapshot>(`${this.baseUrl}/current`); }
  open(request: OpenCashRegisterRequest): Observable<CashRegisterSnapshot> { return this.http.post<CashRegisterSnapshot>(`${this.baseUrl}/open`, request); }
  close(request: CloseCashRegisterRequest): Observable<CashRegisterSnapshot> { return this.http.post<CashRegisterSnapshot>(`${this.baseUrl}/close`, request); }
}
