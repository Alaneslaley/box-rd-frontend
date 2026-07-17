import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';
import { AuthApiService, LoginRequest } from './auth-api.service';
import { AuthSessionStore } from './auth-session.store';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly api = inject(AuthApiService);
  private readonly store = inject(AuthSessionStore);

  login(credentials: LoginRequest): Observable<void> {
    return this.api.login(credentials).pipe(
      tap((response) => this.store.loginSuccess(response)),
      switchMap(() => this.loadCurrentUser()),
    );
  }

  logout(): Observable<void> {
    return this.api.logout().pipe(
      catchError(() => of(undefined)),
      finalize(() => this.store.clearSession()),
    );
  }

  loadCurrentUser(): Observable<void> {
    return this.api.me().pipe(tap((response) => this.store.setCurrentUser(response)), map(() => undefined), catchError((error: ApiError) => {
      if (error.status === 401) this.store.clearSession();
      return throwError(() => error);
    }));
  }

  restoreSession(): void { this.store.restoreSession(); }

  refreshSession(): Observable<void> {
    const refreshToken = this.store.refreshToken();
    if (!refreshToken) return throwError(() => ({ code: 'REFRESH_TOKEN_UNAVAILABLE', message: 'No hay una sesión para renovar.' } satisfies ApiError));
    return this.api.refresh(refreshToken).pipe(tap((response) => this.store.loginSuccess(response)), switchMap(() => this.loadCurrentUser()));
  }
}
