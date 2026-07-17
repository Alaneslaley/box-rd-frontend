import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../core/auth/permissions';
import { ApiError } from '../../core/models/api-error.model';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { formatDateTime, formatMoney } from '../../shared/utils/display-formatters';
import { CashRegisterFacade } from './data-access/cash-register.facade';
import { cashRegisterErrorMessage } from './models/cash-register-error-message';
import { cashStatusLabel, cashStatusTone } from './models/cash-register-labels';
import { CashRegisterSnapshot } from './models/cash-register.models';

@Component({ selector: 'app-cash-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  <app-page-header title="Caja" description="Consulta la caja abierta del usuario autenticado." phase="Sprint 4"><button class="btn btn-secondary" type="button" [disabled]="facade.loading()" (click)="facade.loadCurrentCashRegister()">Refrescar</button></app-page-header>
  @if (openedSuccessfully) { <div class="alert alert-success" role="status">Caja abierta correctamente.</div> }
  @if (closedResult; as closed) { <div class="alert alert-success close-result" role="status"><strong>Caja cerrada correctamente.</strong><span>Efectivo contado: {{ money(closed.countedCash ?? 0, closed.currency) }}</span><span>Diferencia informada por backend: {{ money(closed.difference ?? 0, closed.currency) }}</span></div> }
  @if (facade.loading()) { <app-loading-state message="Consultando caja actual…" /> }
  @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadCurrentCashRegister()">Reintentar</button></app-error-state> }
  @else if (facade.noOpenRegister()) { <app-empty-state title="No hay caja abierta actualmente" description="El backend no encontró una caja abierta para el usuario autenticado.">@if (canOpen) { <a class="btn btn-primary" routerLink="/cash/open">Abrir caja</a> }</app-empty-state> }
  @else if (facade.current(); as current) { <section class="card detail-card finance-detail"><div class="section-heading"><div><h2>Caja actual</h2><p>{{ current.id }}</p></div>@if (canClose) { <a class="btn btn-primary" routerLink="/cash/close">Cerrar caja</a> }</div><dl><div><dt>Estado</dt><dd><app-status-badge [label]="statusLabel(current.status)" [tone]="statusTone(current.status)" /></dd></div><div><dt>Sucursal</dt><dd>{{ current.branchId }}</dd></div><div><dt>Apertura</dt><dd>{{ dateTime(current.openedAt) }}</dd></div><div><dt>Abierta por</dt><dd>{{ current.openedBy }}</dd></div><div><dt>Caja inicial</dt><dd>{{ money(current.initialCash, current.currency) }}</dd></div><div><dt>Caja esperada</dt><dd>{{ money(current.expectedCash, current.currency) }}</dd></div><div><dt>Moneda</dt><dd>{{ current.currency }}</dd></div>@if (current.difference !== null) { <div><dt>Diferencia</dt><dd>{{ money(current.difference, current.currency) }}</dd></div> }@if (current.notes) { <div><dt>Notas</dt><dd>{{ current.notes }}</dd></div> }</dl></section> }
` })
export class CashPageComponent implements OnInit {
  readonly facade = inject(CashRegisterFacade);
  private readonly session = inject(AuthSessionStore);
  private readonly route = inject(ActivatedRoute);
  readonly canOpen = this.session.hasPermission(PERMISSIONS.CASH_OPEN);
  readonly canClose = this.session.hasPermission(PERMISSIONS.CASH_CLOSE);
  readonly openedSuccessfully = this.route.snapshot.queryParamMap.get('opened') === '1';
  readonly closedResult = this.route.snapshot.queryParamMap.get('closed') === '1' ? ((globalThis.history?.state as { closedRegister?: CashRegisterSnapshot } | undefined)?.closedRegister ?? null) : null;
  ngOnInit(): void { this.facade.loadCurrentCashRegister(); }
  errorMessage(error: ApiError): string { return cashRegisterErrorMessage(error, 'No fue posible consultar la caja actual.'); }
  statusLabel = cashStatusLabel; statusTone = cashStatusTone; money = formatMoney; dateTime = formatDateTime;
}
