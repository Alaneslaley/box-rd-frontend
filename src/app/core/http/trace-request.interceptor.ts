import { HttpInterceptorFn } from '@angular/common/http';

function createTraceId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `gymbox-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const traceRequestInterceptor: HttpInterceptorFn = (request, next) =>
  next(request.clone({ setHeaders: { 'X-Trace-Id': createTraceId() } }));
