import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({ selector: 'app-security-home-page', imports: [RouterLink, PageHeaderComponent], template: `
  <app-page-header title="Seguridad administrativa" description="Gestiona usuarios y consulta roles disponibles para la operación." />
  <section class="state-card security-notice"><h2>Gestión segura</h2><p>Administra cuentas, roles y permisos disponibles para la operación.</p></section>
  <section class="security-home-grid">
    @if (canReadUsers) { <a class="card security-home-card" routerLink="/security/users"><h2>Usuarios</h2><p>Consulta usuarios, crea cuentas y administra su estado o roles según tus permisos.</p><span class="btn btn-link">Abrir usuarios</span></a> }
    @if (canReadRoles) { <a class="card security-home-card" routerLink="/security/roles"><h2>Roles</h2><p>Consulta los roles y permisos disponibles.</p><span class="btn btn-link">Abrir roles</span></a> }
  </section>
` })
export class SecurityHomePageComponent {
  private readonly session = inject(AuthSessionStore);
  readonly canReadUsers = this.session.hasAnyPermission([PERMISSIONS.USERS_READ, PERMISSIONS.SECURITY_READ]);
  readonly canReadRoles = this.session.hasPermission(PERMISSIONS.ROLES_READ);
}
