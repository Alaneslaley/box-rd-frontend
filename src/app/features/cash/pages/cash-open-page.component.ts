import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { CashOpenFormComponent } from '../components/cash-open-form.component';
import { CashRegisterFacade } from '../data-access/cash-register.facade';
import { cashRegisterErrorMessage } from '../models/cash-register-error-message';
import { OpenCashRegisterRequest } from '../models/cash-register.models';

@Component({ selector: 'app-cash-open-page', imports: [PageHeaderComponent, ErrorStateComponent, CashOpenFormComponent], template: `
  <app-page-header title="Abrir caja" description="Inicia el turno de caja del usuario autenticado." phase="Sprint 4" />
  @if (error(); as message) { <app-error-state title="No fue posible abrir la caja" [message]="message" [traceId]="traceId()" /> }
  <app-cash-open-form [initialBranchId]="branchId" [saving]="saving()" (submitted)="save($event)" (cancelled)="cancel()" />` })
export class CashOpenPageComponent {
  private readonly facade = inject(CashRegisterFacade); private readonly session = inject(AuthSessionStore); private readonly router = inject(Router);
  readonly branchId = this.session.user()?.branchId ?? '';
  readonly saving = signal(false); readonly error = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined);
  save(request: OpenCashRegisterRequest): void { if (this.saving()) return; this.saving.set(true); this.error.set(null); this.traceId.set(undefined); this.facade.openCashRegister(request).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => void this.router.navigate(['/cash'], { queryParams: { opened: '1' } }), error: (error: ApiError) => { this.error.set(cashRegisterErrorMessage(error, 'No fue posible abrir la caja.')); this.traceId.set(error.traceId); } }); }
  cancel(): void { void this.router.navigate(['/cash']); }
}
