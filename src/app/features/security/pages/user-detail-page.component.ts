import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { SecurityFacade } from '../data-access/security.facade';
import { currentUserNavigationState } from '../data-access/user-route-state';
import { securityErrorMessage } from '../models/security-error-message';
import { passwordChangeLabel, passwordChangeTone, userStatusLabel, userStatusTone } from '../models/security-labels';
import { UserSnapshot } from '../models/security.models';

@Component({ selector: 'app-user-detail-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  @if (loading()) { <app-loading-state message="Cargando usuario desde el listado…" /> }
  @else if (error(); as message) { <app-error-state [message]="message" [traceId]="traceId()"><a class="btn btn-secondary" routerLink="/security/users">Volver al listado</a></app-error-state> }
  @else if (user(); as current) { <app-page-header [title]="current.firstName + ' ' + current.lastName" description="Detalle visual obtenido desde el listado de usuarios; el contrato no incluye consulta individual." phase="Sprint 7"><div class="header-actions"><a class="btn btn-secondary" routerLink="/security/users">Volver</a>@if (canRoles) { <a class="btn btn-primary" [routerLink]="['/security/users', current.id, 'roles']" [state]="{ user: current }">Cambiar roles</a> }@if (canStatus) { <a class="btn btn-secondary" [routerLink]="['/security/users', current.id, 'status']" [state]="{ user: current }">Cambiar estado</a> }</div></app-page-header>
    <section class="card detail-card security-detail"><dl><div><dt>Correo</dt><dd>{{ current.email }}</dd></div><div><dt>Sucursal</dt><dd>{{ current.branchId }}</dd></div><div><dt>Estado</dt><dd><app-status-badge [label]="statusLabel(current.status)" [tone]="statusTone(current.status)" /></dd></div><div><dt>Versión de autorización</dt><dd>{{ current.authzVersion }}</dd></div><div><dt>Contraseña</dt><dd><app-status-badge [label]="passwordLabel(current.mustChangePassword)" [tone]="passwordTone(current.mustChangePassword)" /></dd></div><div><dt>Roles</dt><dd><div class="chip-row">@for (role of current.roles; track role) { <span class="role-chip">{{ role }}</span> }</div></dd></div><div class="detail-wide"><dt>Permisos asociados</dt><dd><div class="chip-row">@for (permission of current.permissions; track permission) { <span class="permission-chip">{{ permission }}</span> }@empty { <span class="muted">El backend no devolvió permisos para este usuario.</span> }</div></dd></div></dl></section>
  }
` })
export class UserDetailPageComponent implements OnInit {
  private readonly facade = inject(SecurityFacade); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); private readonly session = inject(AuthSessionStore);
  readonly user = signal<UserSnapshot | null>(null); readonly loading = signal(true); readonly error = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined);
  readonly canRoles = this.session.hasPermission(PERMISSIONS.USERS_ROLES); readonly canStatus = this.session.hasPermission(PERMISSIONS.USERS_STATUS);
  ngOnInit(): void { const id = this.route.snapshot.paramMap.get('id') ?? ''; this.facade.resolveUserFromCurrentPageOrState(id, currentUserNavigationState(this.router)).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (user) => { if (user) this.user.set(user); else this.error.set('No se pudo cargar el usuario desde la página actual. Vuelve al listado y abre el detalle nuevamente.'); }, error: (error: ApiError) => { this.error.set(securityErrorMessage(error, 'No fue posible cargar el usuario.')); this.traceId.set(error.traceId); } }); }
  statusLabel = userStatusLabel; statusTone = userStatusTone; passwordLabel = passwordChangeLabel; passwordTone = passwordChangeTone;
}
