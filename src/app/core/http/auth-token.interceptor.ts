import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionStore } from '../auth/auth-session.store';

const AUTH_ROUTES = ['/auth/login', '/auth/refresh'];
export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthSessionStore).accessToken();
  if (!token || AUTH_ROUTES.some((path) => request.url.includes(path))) return next(request);
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
