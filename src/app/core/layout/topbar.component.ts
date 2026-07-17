import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '../auth/auth.facade';
import { AuthSessionStore } from '../auth/auth-session.store';
import { LoadingService } from '../http/loading.service';

@Component({ selector: 'app-topbar', template: `
  <header class="topbar"><div><p class="eyebrow">Administración</p><strong>Operación GymBox</strong></div>
  <div class="topbar-actions">@if (loading.isLoading()) { <span class="loading-inline" role="status">Cargando…</span> }
    <span class="user-name">{{ session.user()?.fullName || session.user()?.name || session.user()?.username || 'Usuario' }}</span>
    <button class="btn btn-secondary" type="button" (click)="logout()">Cerrar sesión</button>
  </div></header>` })
export class TopbarComponent {
  readonly session = inject(AuthSessionStore); readonly loading = inject(LoadingService);
  private readonly auth = inject(AuthFacade); private readonly router = inject(Router);
  logout(): void { this.auth.logout().subscribe({ complete: () => void this.router.navigate(['/auth/login']) }); }
}
