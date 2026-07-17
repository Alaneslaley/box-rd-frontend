import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { formatDateTime, formatMoney } from '../../../shared/utils/display-formatters';
import { PaymentsFacade } from '../data-access/payments.facade';
import { paymentErrorMessage } from '../models/payment-error-message';
import { paymentConceptLabel, paymentMethodLabel, paymentStatusLabel, paymentStatusTone } from '../models/payment-labels';

@Component({ selector: 'app-payments-list-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  <app-page-header title="Pagos" description="Consulta los pagos registrados y sus recibos emitidos por el backend." phase="Sprint 4">@if (canRegister) { <a class="btn btn-primary" routerLink="/payments/new">Registrar pago</a> }</app-page-header>
  @if (facade.loading()) { <app-loading-state message="Cargando pagos…" /> }
  @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadPayments()">Reintentar</button></app-error-state> }
  @else if (!facade.page()?.content?.length) { <app-empty-state title="No hay pagos para mostrar" description="Todavía no hay pagos registrados en esta página." /> }
  @else if (facade.page(); as page) { <section class="card students-table-card finance-table"><div class="table-wrapper"><table><caption>Pagos registrados</caption><thead><tr><th scope="col">Folio</th><th scope="col">Alumno</th><th scope="col">Membresía</th><th scope="col">Método</th><th scope="col">Concepto</th><th scope="col">Importe</th><th scope="col">Moneda</th><th scope="col">Estado</th><th scope="col">Registro</th><th scope="col">Acciones</th></tr></thead><tbody>
    @for (payment of page.content; track payment.id) { <tr><td data-label="Folio"><strong>{{ payment.folio }}</strong></td><td data-label="Alumno"><a [routerLink]="['/students', payment.studentId]">Ver alumno</a><small class="id-text">{{ payment.studentId }}</small></td><td data-label="Membresía"><span class="id-text">{{ payment.membershipId }}</span></td><td data-label="Método">{{ methodLabel(payment.method) }}</td><td data-label="Concepto">{{ conceptLabel(payment.concept) }}</td><td data-label="Importe">{{ money(payment.amount, payment.currency) }}</td><td data-label="Moneda">{{ payment.currency }}</td><td data-label="Estado"><app-status-badge [label]="statusLabel(payment.status)" [tone]="statusTone(payment.status)" /></td><td data-label="Registro">{{ dateTime(payment.registeredAt) }}</td><td data-label="Acciones"><div class="table-actions">@if (canDetail) { <a class="btn btn-link" [routerLink]="['/payments', payment.id]">Detalle</a> }@if (canReceipt) { <a class="btn btn-link" [routerLink]="['/payments', payment.id, 'receipt']">Recibo</a> }</div></td></tr> }
  </tbody></table></div><nav class="pagination" aria-label="Paginación de pagos"><button class="btn btn-secondary" type="button" [disabled]="page.first" (click)="facade.changePage(page.page - 1)">Anterior</button><span>Página {{ page.page + 1 }} de {{ page.totalPages || 1 }} · {{ page.totalElements }} pagos</span><button class="btn btn-secondary" type="button" [disabled]="page.last" (click)="facade.changePage(page.page + 1)">Siguiente</button></nav></section> }
` })
export class PaymentsListPageComponent implements OnInit {
  readonly facade = inject(PaymentsFacade);
  private readonly session = inject(AuthSessionStore);
  readonly canRegister = this.session.hasPermission(PERMISSIONS.PAYMENTS_REGISTER);
  readonly canDetail = this.session.hasPermission(PERMISSIONS.PAYMENTS_DETAIL);
  readonly canReceipt = this.session.hasPermission(PERMISSIONS.PAYMENTS_RECEIPT);
  ngOnInit(): void { this.facade.loadPayments(); }
  errorMessage(error: ApiError): string { return paymentErrorMessage(error, 'No fue posible cargar los pagos.'); }
  methodLabel = paymentMethodLabel; conceptLabel = paymentConceptLabel; statusLabel = paymentStatusLabel; statusTone = paymentStatusTone; money = formatMoney; dateTime = formatDateTime;
}
