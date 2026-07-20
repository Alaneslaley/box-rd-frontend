import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { formatMoney } from '../../../shared/utils/display-formatters';
import { CashCloseFormComponent } from '../components/cash-close-form.component';
import { CashRegisterFacade } from '../data-access/cash-register.facade';
import { cashRegisterErrorMessage } from '../models/cash-register-error-message';
import { CloseCashRegisterRequest } from '../models/cash-register.models';

@Component({ selector: 'app-cash-close-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, CashCloseFormComponent], template: `
  <app-page-header title="Cerrar caja" description="Captura el efectivo contado para finalizar el turno." />
  @if (facade.loading()) { <app-loading-state message="Cargando caja actual…" /> }
  @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><a class="btn btn-secondary" routerLink="/cash">Volver</a></app-error-state> }
  @else if (facade.noOpenRegister()) { <app-empty-state title="No hay caja abierta para cerrar" description="Consulta el estado de caja o abre una nueva caja."><a class="btn btn-secondary" routerLink="/cash">Volver a caja</a></app-empty-state> }
  @else if (facade.current(); as current) { <section class="card cash-close-summary"><h2>Resumen antes del cierre</h2><div><span>Caja inicial</span><strong>{{ money(current.initialCash, current.currency) }}</strong></div><div><span>Caja esperada</span><strong>{{ money(current.expectedCash, current.currency) }}</strong></div><p>La diferencia no se calcula en esta pantalla.</p></section>@if (saveError(); as message) { <app-error-state title="No fue posible cerrar la caja" [message]="message" [traceId]="traceId()" /> }<app-cash-close-form [currency]="current.currency" [saving]="saving()" (submitted)="save($event)" (cancelled)="cancel()" /> }
` })
export class CashClosePageComponent implements OnInit {
  readonly facade = inject(CashRegisterFacade); private readonly router = inject(Router);
  readonly saving = signal(false); readonly saveError = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined);
  ngOnInit(): void { this.facade.loadCurrentCashRegister(); }
  save(request: CloseCashRegisterRequest): void { if (this.saving()) return; this.saving.set(true); this.saveError.set(null); this.traceId.set(undefined); this.facade.closeCashRegister(request).pipe(finalize(() => this.saving.set(false))).subscribe({ next: (register) => void this.router.navigate(['/cash'], { queryParams: { closed: '1' }, state: { closedRegister: register } }), error: (error: ApiError) => { this.saveError.set(cashRegisterErrorMessage(error, 'No fue posible cerrar la caja.')); this.traceId.set(error.traceId); } }); }
  cancel(): void { void this.router.navigate(['/cash']); }
  errorMessage(error: ApiError): string { return cashRegisterErrorMessage(error, 'No fue posible cargar la caja actual.'); }
  money = formatMoney;
}
