import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AuthRefreshService } from '../auth/auth-refresh.service';
import { AuthSessionStore } from '../auth/auth-session.store';
import { AppEnvironment } from '../config/app-environment';
import { APP_CONFIG } from '../config/app-config.token';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  const config: AppEnvironment = { production: true, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: '1' };
  const session = { accessToken: vi.fn(() => 'new-token'), clearSession: vi.fn() };
  const refresh = { refreshOnce: vi.fn(() => of(undefined)) };
  const router = { url: '/students', navigate: vi.fn(() => Promise.resolve(true)) };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_CONFIG, useValue: config },
        { provide: AuthSessionStore, useValue: session },
        { provide: AuthRefreshService, useValue: refresh },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('no cierra la sesión si la petición reintentada falla con 500', async () => {
    const next = vi.fn()
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 401 })))
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500, error: { message: 'stack interno' } })));
    const request = new HttpRequest('GET', '/api/v1/students');
    const observable = TestBed.runInInjectionContext(() => errorInterceptor(request, next));

    await expect(firstValueFrom(observable)).rejects.toMatchObject({ status: 500 });
    expect(refresh.refreshOnce).toHaveBeenCalledOnce();
    expect(session.clearSession).not.toHaveBeenCalled();
    expect(next.mock.calls[1][0].headers.get('Authorization')).toBe('Bearer new-token');
  });

  it('limpia la sesión si el reintento también responde 401', async () => {
    const next = vi.fn()
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 401 })))
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 401 })));
    const request = new HttpRequest('GET', '/api/v1/students');
    const observable = TestBed.runInInjectionContext(() => errorInterceptor(request, next));

    await expect(firstValueFrom(observable)).rejects.toMatchObject({ status: 401 });
    expect(session.clearSession).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { returnUrl: '/students' } });
  });
});
