import { Component, OnInit, inject } from '@angular/core';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { SecurityFacade } from '../data-access/security.facade';
import { securityErrorMessage } from '../models/security-error-message';

@Component({ selector: 'app-roles-list-page', imports: [PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent], template: `
  <app-page-header title="Roles" description="Consulta roles y permisos publicados por el backend; esta pantalla no modifica el catálogo." phase="Sprint 7"><button class="btn btn-secondary" type="button" (click)="facade.loadRoles()">Refrescar</button></app-page-header>
  @if (facade.rolesLoading()) { <app-loading-state message="Cargando roles…" /> }
  @else if (facade.rolesError(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadRoles()">Reintentar</button></app-error-state> }
  @else if (!facade.roles().length) { <app-empty-state title="No hay roles disponibles" description="El backend no devolvió roles para esta sesión." /> }
  @else { <section class="card students-table-card roles-table"><div class="table-wrapper"><table><caption>Roles disponibles</caption><thead><tr><th>Código</th><th>Nombre</th><th>Descripción</th><th>Permisos</th></tr></thead><tbody>@for (role of facade.roles(); track role.id) { <tr><td data-label="Código"><strong>{{ role.code }}</strong></td><td data-label="Nombre">{{ role.name }}</td><td data-label="Descripción">{{ role.description || 'Sin descripción' }}</td><td data-label="Permisos"><div class="chip-row">@for (permission of role.permissions; track permission) { <span class="permission-chip">{{ permission }}</span> }@empty { <span class="muted">Sin permisos informados</span> }</div></td></tr> }</tbody></table></div></section> }
` })
export class RolesListPageComponent implements OnInit {
  readonly facade = inject(SecurityFacade); ngOnInit(): void { this.facade.loadRoles(); }
  errorMessage(error: ApiError): string { return securityErrorMessage(error, 'No fue posible cargar los roles.'); }
}
