import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { DisplayNameResolverService } from '../../../core/display/display-name-resolver.service';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { formatDateTime, formatMoney } from '../../../shared/utils/display-formatters';
import { PaymentsFacade } from '../data-access/payments.facade';
import { paymentErrorMessage } from '../models/payment-error-message';
import { paymentConceptLabel, paymentMethodLabel, paymentStatusLabel, paymentStatusTone } from '../models/payment-labels';
import { PaymentSnapshot } from '../models/payment.models';

@Component({ selector: 'app-payment-detail-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  @if (loading()) { <app-loading-state message="Cargando pago…" /> }
  @else if (error(); as message) { <app-error-state [message]="message" [traceId]="traceId()"><a class="btn btn-secondary" routerLink="/payments">Volver a pagos</a></app-error-state> }
  @else if (payment(); as current) {
    <app-page-header [title]="'Pago ' + current.folio" description="Consulta la información registrada del pago."><div class="header-actions"><a class="btn btn-secondary" routerLink="/payments">Volver</a>@if (canReceipt) { <a class="btn btn-primary" [routerLink]="['/payments', current.id, 'receipt']">Ver recibo</a> }</div></app-page-header>
    @if (registeredSuccessfully) { <div class="alert alert-success" role="status">Pago registrado correctamente.</div> }
    <section class="card detail-card finance-detail"><dl><div><dt>Folio</dt><dd>{{ current.folio }}</dd></div><div><dt>Estado</dt><dd><app-status-badge [label]="statusLabel(current.status)" [tone]="statusTone(current.status)" /></dd></div><div><dt>Alumno</dt><dd><a [routerLink]="['/students', current.studentId]">{{ display.studentName(current.studentName) }}</a></dd></div><div><dt>Sucursal</dt><dd>{{ display.branchLabel(current.branchName, 'Sucursal actual') }}</dd></div><div><dt>Membresía</dt><dd>{{ display.membershipLabel() }}</dd></div><div><dt>Caja</dt><dd>{{ current.cashRegisterId ? display.cashRegisterLabel() : 'No aplica para este método' }}</dd></div><div><dt>Método</dt><dd>{{ methodLabel(current.method) }}</dd></div><div><dt>Concepto</dt><dd>{{ conceptLabel(current.concept) }}</dd></div><div><dt>Importe</dt><dd>{{ money(current.amount, current.currency) }}</dd></div><div><dt>Moneda</dt><dd>{{ current.currency }}</dd></div><div><dt>Registrado</dt><dd>{{ dateTime(current.registeredAt) }}</dd></div></dl></section>
  }` })
export class PaymentDetailPageComponent implements OnInit {
  private readonly facade = inject(PaymentsFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly session = inject(AuthSessionStore);
  readonly display = inject(DisplayNameResolverService);
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly registeredSuccessfully = this.route.snapshot.queryParamMap.get('registered') === '1';
  readonly loading = signal(true); readonly payment = signal<PaymentSnapshot | null>(null); readonly error = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined);
  readonly canReceipt = this.session.hasPermission(PERMISSIONS.PAYMENTS_RECEIPT);
  ngOnInit(): void { this.facade.loadPaymentDetail(this.id).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (payment) => this.payment.set(payment), error: (error: ApiError) => { this.error.set(paymentErrorMessage(error, 'No fue posible cargar el pago.')); this.traceId.set(error.traceId); } }); }
  methodLabel = paymentMethodLabel; conceptLabel = paymentConceptLabel; statusLabel = paymentStatusLabel; statusTone = paymentStatusTone; money = formatMoney; dateTime = formatDateTime;
}
