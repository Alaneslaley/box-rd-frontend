import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { DisplayNameResolverService } from '../../../core/display/display-name-resolver.service';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { formatDateTime, formatMoney } from '../../../shared/utils/display-formatters';
import { PaymentsFacade } from '../data-access/payments.facade';
import { paymentErrorMessage } from '../models/payment-error-message';
import { paymentMethodLabel, receiptStatusLabel, receiptStatusTone } from '../models/payment-labels';
import { ReceiptSnapshot } from '../models/payment.models';

@Component({ selector: 'app-payment-receipt-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  @if (loading()) { <app-loading-state message="Cargando recibo…" /> }
  @else if (error(); as message) { <app-error-state [message]="message" [traceId]="traceId()"><a class="btn btn-secondary" [routerLink]="['/payments', paymentId]">Volver al pago</a></app-error-state> }
  @else if (receipt(); as current) { <div class="receipt-page"><app-page-header [title]="'Recibo ' + current.receiptNumber" description="Comprobante de pago de GymBox."><div class="header-actions no-print"><a class="btn btn-secondary" [routerLink]="['/payments', paymentId]">Volver al pago</a><button class="btn btn-primary" type="button" (click)="print()">Imprimir</button></div></app-page-header>
    <section class="card receipt-card"><div class="receipt-brand"><strong>GymBox</strong><span>Comprobante de pago</span></div><dl><div><dt>Número de recibo</dt><dd>{{ current.receiptNumber }}</dd></div><div><dt>Folio de pago</dt><dd>{{ current.paymentFolio }}</dd></div><div><dt>Alumno</dt><dd>{{ display.studentName(current.studentName) }}</dd></div><div><dt>Importe</dt><dd>{{ money(current.amount, current.currency) }}</dd></div><div><dt>Moneda</dt><dd>{{ current.currency }}</dd></div><div><dt>Método</dt><dd>{{ methodLabel(current.paymentMethod) }}</dd></div><div><dt>Estado</dt><dd><app-status-badge [label]="receiptLabel(current.status)" [tone]="receiptTone(current.status)" /></dd></div><div><dt>Entrega</dt><dd><app-status-badge [label]="receiptLabel(current.deliveryStatus)" [tone]="receiptTone(current.deliveryStatus)" /></dd></div><div><dt>Generado</dt><dd>{{ dateTime(current.generatedAt) }}</dd></div></dl></section>
  </div> }` })
export class PaymentReceiptPageComponent implements OnInit {
  private readonly facade = inject(PaymentsFacade); private readonly route = inject(ActivatedRoute);
  readonly display = inject(DisplayNameResolverService);
  readonly paymentId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly loading = signal(true); readonly receipt = signal<ReceiptSnapshot | null>(null); readonly error = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined);
  ngOnInit(): void { this.facade.loadReceipt(this.paymentId).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (receipt) => this.receipt.set(receipt), error: (error: ApiError) => { this.error.set(paymentErrorMessage(error, 'No fue posible cargar el recibo.')); this.traceId.set(error.traceId); } }); }
  print(): void { if (typeof window !== 'undefined') window.print(); }
  methodLabel = paymentMethodLabel; receiptLabel = receiptStatusLabel; receiptTone = receiptStatusTone; money = formatMoney; dateTime = formatDateTime;
}
