import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionStore } from '../auth/auth-session.store';
import { APP_CONFIG } from '../config/app-config.token';
import { isApiRequest, isPublicAuthRequest } from './api-request.util';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthSessionStore).accessToken();
  const config = inject(APP_CONFIG);
  if (!token || !isApiRequest(request.url, config) || isPublicAuthRequest(request.url)) return next(request);
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
