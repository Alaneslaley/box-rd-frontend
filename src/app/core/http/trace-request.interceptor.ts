import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG } from '../config/app-config.token';
import { isApiRequest } from './api-request.util';

function createTraceId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `gymbox-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const traceRequestInterceptor: HttpInterceptorFn = (request, next) => {
  const config = inject(APP_CONFIG);
  return isApiRequest(request.url, config) ? next(request.clone({ setHeaders: { 'X-Trace-Id': createTraceId() } })) : next(request);
};
