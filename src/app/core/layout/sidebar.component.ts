import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthSessionStore } from '../auth/auth-session.store';
import { MenuItem } from '../models/menu-item.model';

const MENU: MenuItem[] = [
  { label: 'Dashboard', route: '/dashboard', permissionsAny: ['dashboard.read'], phase: 'Fase 1' },
  { label: 'Alumnos', route: '/students', permissionsAny: ['students.read'], phase: 'Fase 1' },
  { label: 'Membresías', route: '/memberships', permissionsAny: ['memberships.read'], phase: 'Fase 1' },
  { label: 'Pagos', route: '/payments', permissionsAny: ['payments.read'], phase: 'Fase 1' },
  { label: 'Caja', route: '/cash', permissionsAny: ['cash.read-current'], phase: 'Fase 1' },
  { label: 'Asistencia', route: '/attendance', permissionsAny: ['attendance.read'], phase: 'Fase 1' },
  { label: 'Reportes', route: '/reports', permissionsAny: ['reports.admin.read'], phase: 'Fase 1' },
  { label: 'Seguridad', route: '/security', permissionsAny: ['users.read'], phase: 'Fase 1' },
  { label: 'Deportivo', route: '/sports', permissionsAny: ['sports.dashboard.read'], phase: 'Fase 3' },
];

@Component({ selector: 'app-sidebar', imports: [RouterLink, RouterLinkActive], template: `
  <aside class="sidebar"><a class="brand" routerLink="/dashboard"><span>GB</span><strong>GymBox</strong></a>
  <nav aria-label="Navegación principal"><p class="nav-label">Módulos</p>
    @for (item of menu; track item.route) { @if (!item.permissionsAny || session.hasAnyPermission(item.permissionsAny)) {
      <a [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><span>{{ item.label }}</span><small>{{ item.phase }}</small></a>
    } }
  </nav><p class="sidebar-note">Los permisos del menú son una ayuda visual. El servidor valida el acceso real.</p></aside>` })
export class SidebarComponent { readonly session = inject(AuthSessionStore); readonly menu = MENU; }
