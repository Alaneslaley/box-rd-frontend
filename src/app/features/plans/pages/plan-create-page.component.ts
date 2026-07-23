import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { PlanFormComponent } from '../components/plan-form.component';
import { PlansFacade } from '../data-access/plans.facade';
import { planErrorMessage } from '../models/plan-error-message';
import { CreatePlanRequest } from '../models/plan.models';

@Component({ selector: 'app-plan-create-page', imports: [PageHeaderComponent, ErrorStateComponent, PlanFormComponent], template: `
  <app-page-header title="Nuevo plan" description="Agrega un plan al catálogo de la sucursal." />
  @if (error(); as message) { <app-error-state title="No fue posible guardar el plan" [message]="message" [traceId]="traceId()" /> }
  <app-plan-form [saving]="saving()" submitLabel="Crear plan" (createSubmitted)="save($event)" (cancelled)="cancel()" />` })
export class PlanCreatePageComponent {
  private readonly facade = inject(PlansFacade);
  private readonly session = inject(AuthSessionStore);
  private readonly router = inject(Router);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  save(formValue: CreatePlanRequest): void {
    if (this.saving()) return;
    this.saving.set(true); this.error.set(null); this.traceId.set(undefined);
    const branchId = this.session.user()?.branchId;
    const request: CreatePlanRequest = { ...formValue, ...(branchId ? { branchId } : {}) };
    this.facade.createPlan(request).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => void this.router.navigate(['/plans']),
      error: (error: ApiError) => { this.error.set(planErrorMessage(error, 'No fue posible crear el plan.')); this.traceId.set(error.traceId); },
    });
  }

  cancel(): void { void this.router.navigate(['/plans']); }
}
