import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthApiService } from '../auth/auth-api.service';
import { AuthSessionStore } from '../auth/auth-session.store';
import { LoadingService } from '../http/loading.service';

@Component({ selector: 'app-topbar', template: `
  <header class="topbar"><div><p class="eyebrow">Administración</p><strong>Operación GymBox</strong></div>
  <div class="topbar-actions">@if (loading.isLoading()) { <span class="loading-inline" role="status">Cargando…</span> }
    <span class="user-name">{{ session.user()?.fullName || session.user()?.username }}</span>
    <button class="btn btn-secondary" type="button" (click)="logout()">Cerrar sesión</button>
  </div></header>` })
export class TopbarComponent {
  readonly session = inject(AuthSessionStore); readonly loading = inject(LoadingService);
  private readonly authApi = inject(AuthApiService); private readonly router = inject(Router);
  logout(): void { this.authApi.logout().pipe(catchError(() => of(undefined)), finalize(() => { this.session.logout(); void this.router.navigate(['/auth/login']); })).subscribe(); }
}
