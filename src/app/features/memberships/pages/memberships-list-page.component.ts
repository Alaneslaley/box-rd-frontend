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
import { planTypeLabel } from '../../plans/models/plan-labels';
import { MembershipsFacade } from '../data-access/memberships.facade';
import { membershipErrorMessage } from '../models/membership-error-message';
import { membershipStatusLabel, membershipStatusTone } from '../models/membership-labels';

@Component({
  selector: 'app-memberships-list-page',
  imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent],
  template: `
    <app-page-header title="Membresías" description="Consulta vigencias y crea o renueva membresías de alumnos." phase="Sprint 3">@if (canCreate) { <a class="btn btn-primary" routerLink="/memberships/new">Nueva membresía</a> }</app-page-header>
    @if (facade.loading()) { <app-loading-state message="Cargando membresías…" /> }
    @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadMemberships()">Reintentar</button></app-error-state> }
    @else if (!facade.page()?.content?.length) { <app-empty-state title="No hay membresías para mostrar" description="Aún no hay membresías registradas en esta página." /> }
    @else if (facade.page(); as page) {
      <section class="card students-table-card"><div class="table-wrapper"><table><caption>Membresías registradas</caption><thead><tr><th scope="col">Alumno</th><th scope="col">Plan</th><th scope="col">Vigencia</th><th scope="col">Clases</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead><tbody>
        @for (membership of page.content; track membership.id) { <tr><td data-label="Alumno"><a [routerLink]="['/students', membership.studentId]">Ver alumno</a><small class="id-text">{{ membership.studentId }}</small></td><td data-label="Plan"><strong>{{ membership.planName }}</strong><small>{{ typeLabel(membership.planType) }}</small></td><td data-label="Vigencia">{{ membership.startDate }} a {{ membership.endDate }}</td><td data-label="Clases">{{ membership.remainingClasses ?? '—' }} / {{ membership.includedClasses ?? '—' }}</td><td data-label="Estado"><app-status-badge [label]="statusLabel(membership.status)" [tone]="statusTone(membership.status)" /></td><td data-label="Acciones">@if (canRenew) { <a class="btn btn-link" [routerLink]="['/memberships', membership.id, 'renew']" [state]="{ membership: membership }">Renovar</a> } @else { <span class="muted">Solo consulta</span> }</td></tr> }
      </tbody></table></div><nav class="pagination" aria-label="Paginación de membresías"><button class="btn btn-secondary" type="button" [disabled]="page.first" (click)="facade.changePage(page.page - 1)">Anterior</button><span>Página {{ page.page + 1 }} de {{ page.totalPages || 1 }} · {{ page.totalElements }} membresías</span><button class="btn btn-secondary" type="button" [disabled]="page.last" (click)="facade.changePage(page.page + 1)">Siguiente</button></nav></section>
    }
  `,
})
export class MembershipsListPageComponent implements OnInit {
  readonly facade = inject(MembershipsFacade);
  private readonly session = inject(AuthSessionStore);
  readonly canCreate = this.session.hasPermission(PERMISSIONS.MEMBERSHIPS_CREATE);
  readonly canRenew = this.session.hasPermission(PERMISSIONS.MEMBERSHIPS_RENEW);
  ngOnInit(): void { this.facade.loadMemberships(); }
  typeLabel = planTypeLabel;
  statusLabel = membershipStatusLabel;
  statusTone = membershipStatusTone;
  errorMessage(error: ApiError): string { return membershipErrorMessage(error, 'No fue posible cargar las membresías.'); }
}
