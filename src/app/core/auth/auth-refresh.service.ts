import { Injectable, inject } from '@angular/core';
import { Observable, finalize, map, shareReplay, tap, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';
import { AuthApiService } from './auth-api.service';
import { AuthSessionStore } from './auth-session.store';

@Injectable({ providedIn: 'root' })
export class AuthRefreshService {
  private readonly api = inject(AuthApiService);
  private readonly session = inject(AuthSessionStore);
  private inFlight: Observable<void> | null = null;

  refreshOnce(): Observable<void> {
    if (this.inFlight) return this.inFlight;
    const refreshToken = this.session.refreshToken();
    if (!refreshToken) return throwError(() => ({ code: 'REFRESH_TOKEN_UNAVAILABLE', message: 'No hay una sesión para renovar.' } satisfies ApiError));

    this.inFlight = this.api.refresh(refreshToken).pipe(
      tap((tokens) => this.session.loginSuccess(tokens)),
      map(() => undefined),
      finalize(() => { this.inFlight = null; }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.inFlight;
  }
}
