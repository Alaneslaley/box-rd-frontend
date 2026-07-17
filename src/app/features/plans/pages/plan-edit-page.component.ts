import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { PlanFormComponent } from '../components/plan-form.component';
import { PlansFacade } from '../data-access/plans.facade';
import { planErrorMessage } from '../models/plan-error-message';
import { PlanSnapshot, UpdatePlanRequest } from '../models/plan.models';

@Component({ selector: 'app-plan-edit-page', imports: [PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, PlanFormComponent], template: `
  <app-page-header title="Editar plan" description="Actualiza los campos permitidos por el contrato del backend." phase="Sprint 3" />
  @if (loading()) { <app-loading-state message="Cargando plan…" /> }
  @else if (loadError(); as message) { <app-error-state [message]="message" [traceId]="traceId()"><button class="btn btn-secondary" type="button" (click)="cancel()">Volver a planes</button></app-error-state> }
  @else if (plan(); as current) { @if (saveError(); as message) { <app-error-state title="No fue posible guardar los cambios" [message]="message" [traceId]="traceId()" /> }<app-plan-form mode="edit" [plan]="current" [saving]="saving()" submitLabel="Guardar cambios" (updateSubmitted)="save($event)" (cancelled)="cancel()" /> }` })
export class PlanEditPageComponent implements OnInit {
  private readonly facade = inject(PlansFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly plan = signal<PlanSnapshot | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  ngOnInit(): void {
    const navigationPlan = (globalThis.history?.state as { plan?: PlanSnapshot } | undefined)?.plan;
    if (navigationPlan?.id === this.id) { this.plan.set(navigationPlan); this.loading.set(false); return; }
    this.facade.findPlanById(this.id).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (plan) => { if (plan) this.plan.set(plan); else this.loadError.set('El plan no se encontró en el catálogo disponible. Vuelve al listado e intenta nuevamente.'); },
      error: (error: ApiError) => { this.loadError.set(planErrorMessage(error, 'No fue posible recuperar el plan.')); this.traceId.set(error.traceId); },
    });
  }

  save(request: UpdatePlanRequest): void {
    this.saving.set(true); this.saveError.set(null); this.traceId.set(undefined);
    this.facade.updatePlan(this.id, request).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => void this.router.navigate(['/plans']),
      error: (error: ApiError) => { this.saveError.set(planErrorMessage(error, 'No fue posible actualizar el plan.')); this.traceId.set(error.traceId); },
    });
  }

  cancel(): void { void this.router.navigate(['/plans']); }
}
