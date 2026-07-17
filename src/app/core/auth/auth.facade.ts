import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';
import { AuthApiService, LoginRequest } from './auth-api.service';
import { AuthSessionStore } from './auth-session.store';
import { AuthRefreshService } from './auth-refresh.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly api = inject(AuthApiService);
  private readonly store = inject(AuthSessionStore);
  private readonly refresh = inject(AuthRefreshService);

  login(credentials: LoginRequest): Observable<void> {
    this.store.clearSession();
    return this.api.login(credentials).pipe(
      tap((response) => this.store.loginSuccess(response)),
      switchMap(() => this.loadCurrentUser()),
    );
  }

  logout(): Observable<void> {
    const refreshToken = this.store.refreshToken();
    if (!refreshToken) { this.store.clearSession(); return of(undefined); }
    return this.api.logout(refreshToken).pipe(
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
    return this.refresh.refreshOnce();
  }
}
