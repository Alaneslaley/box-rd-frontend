import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthRefreshService } from '../auth/auth-refresh.service';
import { AuthSessionStore } from '../auth/auth-session.store';
import { ApiError } from '../models/api-error.model';
import { APP_CONFIG } from '../config/app-config.token';
import { isApiRequest, isLogoutRequest, isPublicAuthRequest } from './api-request.util';
import { AUTH_REQUEST_RETRIED } from './http-context.tokens';

function toApiError(error: HttpErrorResponse): ApiError {
  const body = error.error as Partial<ApiError> | null;
  return {
    code: body?.code ?? `HTTP_${error.status || 'NETWORK'}`,
    message: body?.message ?? (error.status === 0 ? 'No fue posible conectar con el servidor.' : 'Ocurrió un error al procesar la solicitud.'),
    details: body?.details,
    timestamp: body?.timestamp,
    traceId: body?.traceId ?? error.headers.get('X-Trace-Id') ?? undefined,
    status: error.status,
  };
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(AuthSessionStore);
  const router = inject(Router);
  const config = inject(APP_CONFIG);
  const refresh = inject(AuthRefreshService);
  return next(request).pipe(catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse && isApiRequest(request.url, config)) {
      if (error.status === 401 && !isPublicAuthRequest(request.url)) {
        if (!isLogoutRequest(request.url) && !request.context.get(AUTH_REQUEST_RETRIED)) {
          return refresh.refreshOnce().pipe(switchMap(() => {
            const token = session.accessToken();
            if (!token) return throwError(() => error);
            const retry = request.clone({ context: request.context.set(AUTH_REQUEST_RETRIED, true), setHeaders: { Authorization: `Bearer ${token}` } });
            return next(retry).pipe(catchError((retryError: unknown) => {
              session.clearSession();
              void router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
              return throwError(() => retryError instanceof HttpErrorResponse ? toApiError(retryError) : retryError);
            }));
          }), catchError(() => {
            session.clearSession();
            void router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
            return throwError(() => toApiError(error));
          }));
        }
        session.clearSession();
        void router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
      }
      if (error.status === 403 && !request.url.includes('/auth/login')) void router.navigate(['/forbidden']);
    }
    return throwError(() => error instanceof HttpErrorResponse ? toApiError(error) : error);
  }));
};
