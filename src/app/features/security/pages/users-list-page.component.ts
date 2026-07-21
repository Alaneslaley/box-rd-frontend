import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { DisplayNameResolverService } from '../../../core/display/display-name-resolver.service';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { SecurityFacade } from '../data-access/security.facade';
import { securityErrorMessage } from '../models/security-error-message';
import { passwordChangeLabel, passwordChangeTone, userStatusLabel, userStatusTone } from '../models/security-labels';

@Component({ selector: 'app-users-list-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  <app-page-header title="Usuarios" description="Consulta cuentas operativas y administra acciones permitidas." phase="Sprint 7"><div class="header-actions"><button class="btn btn-secondary" type="button" (click)="facade.loadUsers()">Refrescar</button>@if (canCreate) { <a class="btn btn-primary" routerLink="/security/users/new">Nuevo usuario</a> }</div></app-page-header>
  @if (successMessage) { <p class="alert alert-success" role="status">{{ successMessage }}</p> }
  @if (facade.usersLoading()) { <app-loading-state message="Cargando usuarios…" /> }
  @else if (facade.usersError(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadUsers()">Reintentar</button></app-error-state> }
  @else if (!facade.usersPage()?.content?.length) { <app-empty-state title="No hay usuarios para mostrar" description="No hay cuentas registradas en esta página.">@if (canCreate) { <a class="btn btn-primary" routerLink="/security/users/new">Crear usuario</a> }</app-empty-state> }
  @else if (facade.usersPage(); as page) { <section class="card students-table-card security-users-table"><div class="table-wrapper"><table><caption>Usuarios registrados</caption><thead><tr><th>Nombre</th><th>Correo</th><th>Sucursal</th><th>Estado</th><th>Roles</th><th>Versión de autorización</th><th>Contraseña</th><th>Acciones</th></tr></thead><tbody>
    @for (user of page.content; track user.id) { <tr><td data-label="Nombre"><strong>{{ user.firstName }} {{ user.lastName }}</strong></td><td data-label="Correo">{{ user.email }}</td><td data-label="Sucursal">{{ display.branchLabel(user.branchName) }}</td><td data-label="Estado"><app-status-badge [label]="statusLabel(user.status)" [tone]="statusTone(user.status)" /></td><td data-label="Roles"><div class="chip-row">@for (role of user.roles; track role) { <span class="role-chip">{{ role }}</span> }</div></td><td data-label="Versión">{{ user.authzVersion }}</td><td data-label="Contraseña"><app-status-badge [label]="passwordLabel(user.mustChangePassword)" [tone]="passwordTone(user.mustChangePassword)" /></td><td data-label="Acciones"><div class="table-actions"><a class="btn btn-link" [routerLink]="['/security/users', user.id]" [state]="{ user: user }">Ver detalle</a>@if (canRoles) { <a class="btn btn-link" [routerLink]="['/security/users', user.id, 'roles']" [state]="{ user: user }">Cambiar roles</a> }@if (canStatus) { <a class="btn btn-link" [routerLink]="['/security/users', user.id, 'status']" [state]="{ user: user }">Cambiar estado</a> }</div></td></tr> }
  </tbody></table></div><nav class="pagination" aria-label="Paginación de usuarios"><button class="btn btn-secondary" type="button" [disabled]="page.first" (click)="facade.changeUsersPage(page.page - 1)">Anterior</button><span>Página {{ page.page + 1 }} de {{ page.totalPages || 1 }} · {{ page.totalElements }} usuarios</span><button class="btn btn-secondary" type="button" [disabled]="page.last" (click)="facade.changeUsersPage(page.page + 1)">Siguiente</button></nav></section> }
` })
export class UsersListPageComponent implements OnInit {
  readonly facade = inject(SecurityFacade); readonly display = inject(DisplayNameResolverService); private readonly session = inject(AuthSessionStore); private readonly router = inject(Router);
  readonly canCreate = this.session.hasPermission(PERMISSIONS.USERS_CREATE); readonly canRoles = this.session.hasPermission(PERMISSIONS.USERS_ROLES); readonly canStatus = this.session.hasPermission(PERMISSIONS.USERS_STATUS);
  readonly successMessage = this.navigationSuccessMessage();
  ngOnInit(): void { this.facade.loadUsers(); }
  private navigationSuccessMessage(): string | null { const state = this.router.getCurrentNavigation()?.extras.state ?? (typeof history !== 'undefined' ? history.state : null); const message = state?.['successMessage']; return typeof message === 'string' ? message : null; }
  errorMessage(error: ApiError): string { return securityErrorMessage(error, 'No fue posible cargar los usuarios.'); }
  statusLabel = userStatusLabel; statusTone = userStatusTone; passwordLabel = passwordChangeLabel; passwordTone = passwordChangeTone;
}
