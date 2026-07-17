import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthSessionStore } from '../auth/auth-session.store';
import { ApiError } from '../models/api-error.model';

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
  return next(request).pipe(catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.includes('/auth/login')) session.clearSession();
    return throwError(() => error instanceof HttpErrorResponse ? toApiError(error) : error);
  }));
};
