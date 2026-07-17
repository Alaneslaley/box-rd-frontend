import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { MembershipsFacade } from '../data-access/memberships.facade';
import { membershipErrorMessage } from '../models/membership-error-message';
import { membershipStatusLabel, membershipStatusTone } from '../models/membership-labels';
import { MembershipSnapshot } from '../models/membership.models';

@Component({ selector: 'app-membership-renew-page', imports: [ReactiveFormsModule, PageHeaderComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  <app-page-header title="Renovar membresía" description="Indica la fecha efectiva; el backend calculará la nueva vigencia." phase="Sprint 3" />
  @if (!membership()) { <app-error-state title="No se pudo abrir la renovación" message="Esta operación debe iniciarse desde el listado de membresías porque el API aún no ofrece consulta por ID."><button class="btn btn-secondary" type="button" (click)="cancel()">Volver al listado</button></app-error-state> }
  @else if (membership(); as current) {
    <section class="card renewal-summary"><h2>{{ current.planName }}</h2><dl><div><dt>Alumno</dt><dd>{{ current.studentId }}</dd></div><div><dt>Vigencia actual</dt><dd>{{ current.startDate }} a {{ current.endDate }}</dd></div><div><dt>Estado</dt><dd><app-status-badge [label]="statusLabel(current.status)" [tone]="statusTone(current.status)" /></dd></div></dl></section>
    @if (error(); as message) { <app-error-state title="No fue posible renovar la membresía" [message]="message" [traceId]="traceId()" /> }
    <form class="card renewal-form" [formGroup]="form" (ngSubmit)="save()" novalidate><div class="form-field"><label for="effective-on">Fecha efectiva *</label><input id="effective-on" type="date" formControlName="effectiveOn" />@if (form.controls.effectiveOn.touched && form.controls.effectiveOn.invalid) { <span class="field-error">Ingresa una fecha en formato válido.</span> }</div><p>La fecha final y el saldo de clases se recibirán de la respuesta del backend.</p><div class="form-actions"><button class="btn btn-secondary" type="button" [disabled]="saving()" (click)="cancel()">Cancelar</button><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Renovando…' : 'Confirmar renovación' }}</button></div></form>
  }` })
export class MembershipRenewPageComponent implements OnInit {
  private readonly facade = inject(MembershipsFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly membership = signal<MembershipSnapshot | null>(null);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);
  readonly form = new FormGroup({ effectiveOn: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)] }) });

  ngOnInit(): void { const state = globalThis.history?.state as { membership?: MembershipSnapshot } | undefined; if (state?.membership?.id === this.id) this.membership.set(state.membership); }
  save(): void {
    if (this.form.invalid || !this.membership()) { this.form.markAllAsTouched(); return; }
    this.saving.set(true); this.error.set(null); this.traceId.set(undefined);
    this.facade.renewMembership(this.id, this.form.getRawValue()).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => void this.router.navigate(['/memberships']),
      error: (error: ApiError) => { this.error.set(membershipErrorMessage(error, 'No fue posible renovar la membresía.')); this.traceId.set(error.traceId); },
    });
  }
  cancel(): void { void this.router.navigate(['/memberships']); }
  statusLabel = membershipStatusLabel;
  statusTone = membershipStatusTone;
}
