import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthRefreshService } from '../auth/auth-refresh.service';
import { AuthSessionStore } from '../auth/auth-session.store';
import { APP_CONFIG } from '../config/app-config.token';
import { isApiRequest, isLogoutRequest, isPublicAuthRequest } from './api-request.util';
import { AUTH_REQUEST_RETRIED } from './http-context.tokens';
import { mapHttpError } from './api-error.mapper';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(AuthSessionStore);
  const router = inject(Router);
  const config = inject(APP_CONFIG);
  const refresh = inject(AuthRefreshService);
  const expireSession = (): void => {
    const returnUrl = router.url.startsWith('/auth/') ? '/dashboard' : router.url;
    session.clearSession();
    void router.navigate(['/auth/login'], { queryParams: { returnUrl } });
  };

  return next(request).pipe(catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse && isApiRequest(request.url, config)) {
      if (error.status === 401 && !isPublicAuthRequest(request.url)) {
        if (!isLogoutRequest(request.url) && !request.context.get(AUTH_REQUEST_RETRIED)) {
          return refresh.refreshOnce().pipe(
            catchError(() => {
              expireSession();
              return throwError(() => mapHttpError(error));
            }),
            switchMap(() => {
              const token = session.accessToken();
              if (!token) {
                expireSession();
                return throwError(() => mapHttpError(error));
              }
              const retry = request.clone({
                context: request.context.set(AUTH_REQUEST_RETRIED, true),
                setHeaders: { Authorization: `Bearer ${token}` },
              });
              return next(retry).pipe(catchError((retryError: unknown) => {
                if (retryError instanceof HttpErrorResponse) {
                  if (retryError.status === 401) expireSession();
                  if (retryError.status === 403) void router.navigate(['/forbidden']);
                  return throwError(() => mapHttpError(retryError));
                }
                return throwError(() => retryError);
              }));
            }),
          );
        }
        expireSession();
      }
      if (error.status === 403 && !request.url.includes('/auth/login')) void router.navigate(['/forbidden']);
    }
    return throwError(() => error instanceof HttpErrorResponse ? mapHttpError(error) : error);
  }));
};
