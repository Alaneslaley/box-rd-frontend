import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { CashRegisterSnapshot, CloseCashRegisterRequest, OpenCashRegisterRequest } from '../models/cash-register.models';
import { CashRegisterApiService } from './cash-register-api.service';

@Injectable({ providedIn: 'root' })
export class CashRegisterFacade {
  private readonly api = inject(CashRegisterApiService);
  private readonly currentState = signal<CashRegisterSnapshot | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<ApiError | null>(null);
  private readonly noOpenRegisterState = signal(false);

  readonly current = this.currentState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly noOpenRegister = this.noOpenRegisterState.asReadonly();

  loadCurrentCashRegister(): void {
    this.loadingState.set(true); this.errorState.set(null); this.noOpenRegisterState.set(false);
    this.api.current().subscribe({
      next: (register) => { this.currentState.set(register); this.loadingState.set(false); },
      error: (error: ApiError) => {
        this.currentState.set(null); this.loadingState.set(false);
        if (error.code === 'OPEN_CASH_REGISTER_NOT_FOUND') this.noOpenRegisterState.set(true); else this.errorState.set(error);
      },
    });
  }

  openCashRegister(request: OpenCashRegisterRequest): Observable<CashRegisterSnapshot> { return this.api.open(request).pipe(tap((register) => this.currentState.set(register))); }
  closeCashRegister(request: CloseCashRegisterRequest): Observable<CashRegisterSnapshot> { return this.api.close(request).pipe(tap((register) => this.currentState.set(register))); }
}
