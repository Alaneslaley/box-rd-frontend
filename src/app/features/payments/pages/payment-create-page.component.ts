import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { IdempotencyKeyService } from '../../../core/http/idempotency-key.service';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { MembershipsApiService } from '../../memberships/data-access/memberships-api.service';
import { MembershipSnapshot } from '../../memberships/models/membership.models';
import { PaymentFormComponent } from '../components/payment-form.component';
import { PaymentsFacade } from '../data-access/payments.facade';
import { paymentErrorMessage } from '../models/payment-error-message';
import { RegisterPaymentRequest } from '../models/payment.models';

@Component({ selector: 'app-payment-create-page', imports: [PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, PaymentFormComponent], template: `
  <app-page-header title="Registrar pago" description="Selecciona una membresía, el método y la fecha efectiva." />
  @if (loadingMemberships()) { <app-loading-state message="Cargando membresías…" /> }
  @else { @if (loadError(); as message) { <app-error-state title="No fue posible cargar el catálogo de membresías" [message]="message" [traceId]="traceId()"><button class="btn btn-secondary" type="button" (click)="loadMemberships()">Reintentar</button></app-error-state> }
    @if (!loadError() || initialMembershipId) { @if (saveError(); as message) { <app-error-state title="No fue posible registrar el pago" [message]="message" [traceId]="traceId()" /> }
      @if (!memberships().length && !initialMembershipId) { <app-empty-state title="No hay membresías disponibles" description="Se requiere una membresía para registrar un pago." /> }
      <app-payment-form [memberships]="memberships()" [initialMembershipId]="initialMembershipId" [saving]="saving()" (submitted)="save($event)" (cancelled)="cancel()" />
    }
  }` })
export class PaymentCreatePageComponent implements OnInit {
  private readonly facade = inject(PaymentsFacade);
  private readonly membershipsApi = inject(MembershipsApiService);
  private readonly keys = inject(IdempotencyKeyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly initialMembershipId = this.route.snapshot.queryParamMap.get('membershipId') ?? '';
  readonly loadingMemberships = signal(true);
  readonly saving = signal(false);
  readonly memberships = signal<MembershipSnapshot[]>([]);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);
  private attemptKey: string | null = null;
  private attemptFingerprint: string | null = null;

  ngOnInit(): void { this.loadMemberships(); }
  loadMemberships(): void {
    this.loadingMemberships.set(true); this.loadError.set(null); this.traceId.set(undefined);
    this.membershipsApi.list({ page: 0, size: 100 }).pipe(finalize(() => this.loadingMemberships.set(false))).subscribe({
      next: (page) => this.memberships.set(page.content),
      error: (error: ApiError) => { this.loadError.set(paymentErrorMessage(error, 'No fue posible cargar las membresías.')); this.traceId.set(error.traceId); },
    });
  }

  save(request: RegisterPaymentRequest): void {
    if (this.saving()) return;
    const fingerprint = `${request.membershipId}|${request.method}|${request.effectiveOn}`;
    try { if (!this.attemptKey || this.attemptFingerprint !== fingerprint) { this.attemptKey = this.keys.generate(); this.attemptFingerprint = fingerprint; } }
    catch { this.saveError.set('No fue posible generar una clave segura para registrar el pago.'); return; }
    this.saving.set(true); this.saveError.set(null); this.traceId.set(undefined);
    this.facade.registerPayment(request, this.attemptKey).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (payment) => { this.attemptKey = null; this.attemptFingerprint = null; void this.router.navigate(['/payments', payment.id], { queryParams: { registered: '1' } }); },
      error: (error: ApiError) => { this.saveError.set(paymentErrorMessage(error, 'No fue posible registrar el pago.')); this.traceId.set(error.traceId); },
    });
  }
  cancel(): void { void this.router.navigate(['/payments']); }
}
