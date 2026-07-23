import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { PlansFacade } from '../data-access/plans.facade';
import { planErrorMessage } from '../models/plan-error-message';
import { planStatusLabel, planStatusTone, planTypeLabel } from '../models/plan-labels';
import { PlanSnapshot } from '../models/plan.models';

@Component({
  selector: 'app-plans-list-page',
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent],
  template: `
    <app-page-header title="Planes" description="Administra el catálogo de planes disponible para las membresías.">@if (canCreate) { <a class="btn btn-primary" routerLink="/plans/new">Nuevo plan</a> }</app-page-header>
    <section class="card catalog-filter"><label class="check-field" for="include-inactive"><input id="include-inactive" type="checkbox" [formControl]="includeInactiveControl" /> Incluir planes inactivos</label></section>
    @if (facade.loading()) { <app-loading-state message="Cargando planes…" /> }
    @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadPlans()">Reintentar</button></app-error-state> }
    @else if (!facade.page()?.content?.length) { <app-empty-state title="No hay planes para mostrar" description="Crea un plan o incluye los planes inactivos para ampliar la consulta." /> }
    @else if (facade.page(); as page) {
      <section class="card students-table-card"><div class="table-wrapper"><table><caption>Catálogo de planes</caption><thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Precio</th><th scope="col">Vigencia</th><th scope="col">Clases</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead><tbody>
        @for (plan of page.content; track plan.id) { <tr><td data-label="Nombre"><strong>{{ plan.name }}</strong><small>{{ plan.description || 'Sin descripción' }}</small></td><td data-label="Tipo">{{ typeLabel(plan.type) }}</td><td data-label="Precio">{{ formatPrice(plan) }}</td><td data-label="Vigencia">{{ plan.validityDays ? plan.validityDays + ' días' : 'No especificada' }}</td><td data-label="Clases">{{ plan.includedClasses ?? 'No especificadas' }}</td><td data-label="Estado"><app-status-badge [label]="statusLabel(plan.status)" [tone]="statusTone(plan.status)" /></td><td data-label="Acciones">@if (canEdit) { <a class="btn btn-link" [routerLink]="['/plans', plan.id, 'edit']" [state]="{ plan: plan }">Editar</a> } @else { <span class="muted">Solo consulta</span> }</td></tr> }
      </tbody></table></div><nav class="pagination" aria-label="Paginación de planes"><button class="btn btn-secondary" type="button" [disabled]="page.first" (click)="facade.changePage(page.page - 1)">Anterior</button><span>Página {{ page.page + 1 }} de {{ page.totalPages || 1 }} · {{ page.totalElements }} planes</span><button class="btn btn-secondary" type="button" [disabled]="page.last" (click)="facade.changePage(page.page + 1)">Siguiente</button></nav></section>
    }
  `,
})
export class PlansListPageComponent implements OnInit {
  readonly facade = inject(PlansFacade);
  private readonly session = inject(AuthSessionStore);
  readonly includeInactiveControl = new FormControl(false, { nonNullable: true });
  readonly canCreate = this.session.hasPermission(PERMISSIONS.PLANS_CREATE);
  readonly canEdit = this.session.hasPermission(PERMISSIONS.PLANS_EDIT);

  ngOnInit(): void {
    this.includeInactiveControl.setValue(this.facade.query().includeInactive, { emitEvent: false });
    this.includeInactiveControl.valueChanges.subscribe((value) => this.facade.setIncludeInactive(value));
    this.facade.loadPlans();
  }

  typeLabel = planTypeLabel;
  statusLabel = planStatusLabel;
  statusTone = planStatusTone;
  errorMessage(error: ApiError): string { return planErrorMessage(error, 'No fue posible cargar los planes.'); }
  formatPrice(plan: PlanSnapshot): string { try { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: plan.currency }).format(plan.price); } catch { return `${plan.price.toFixed(2)} ${plan.currency}`; } }
}
