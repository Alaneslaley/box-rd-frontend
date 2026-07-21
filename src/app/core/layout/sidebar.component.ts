import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthSessionStore } from '../auth/auth-session.store';
import { APP_MENU } from './menu.config';

@Component({ selector: 'app-sidebar', imports: [RouterLink, RouterLinkActive], template: `
  <aside class="sidebar"><a class="brand" routerLink="/dashboard"><span>RD</span><strong>Escuela Box RD</strong></a>
  <nav aria-label="Navegación principal"><p class="nav-label">Módulos</p>
    @for (item of menu; track item.route) { @if (!item.permissionsAny || session.hasAnyPermission(item.permissionsAny)) {
      <a [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><span>{{ item.label }}</span></a>
    } }
  </nav></aside>` })
export class SidebarComponent { readonly session = inject(AuthSessionStore); readonly menu = APP_MENU; }
