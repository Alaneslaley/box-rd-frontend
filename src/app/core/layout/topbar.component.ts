import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '../auth/auth.facade';
import { AuthSessionStore } from '../auth/auth-session.store';
import { LoadingService } from '../http/loading.service';

@Component({ selector: 'app-topbar', template: `
  <header class="topbar"><div><p class="eyebrow">Administración</p><strong>Operación Escuela de box RD</strong></div>
  <div class="topbar-actions">@if (loading.isLoading()) { <span class="loading-inline" role="status">Cargando…</span> }
    <span class="user-name">{{ session.user() ? session.user()?.firstName + ' ' + session.user()?.lastName : 'Usuario' }}</span>
    <button class="btn btn-secondary" type="button" [disabled]="loggingOut()" (click)="logout()">{{ loggingOut() ? 'Cerrando sesión…' : 'Cerrar sesión' }}</button>
  </div></header>` })
export class TopbarComponent {
  readonly session = inject(AuthSessionStore); readonly loading = inject(LoadingService);
  readonly loggingOut = signal(false);
  private readonly auth = inject(AuthFacade); private readonly router = inject(Router);
  logout(): void {
    if (this.loggingOut()) return;
    this.loggingOut.set(true);
    this.auth.logout().subscribe({ complete: () => void this.router.navigate(['/auth/login']) });
  }
}
