import { TestBed } from '@angular/core/testing';
import { Subject, firstValueFrom, throwError } from 'rxjs';
import { AuthApiService, AuthTokens } from './auth-api.service';
import { AuthRefreshService } from './auth-refresh.service';
import { AuthSessionStore } from './auth-session.store';

describe('AuthRefreshService', () => {
  const api = { refresh: vi.fn() };
  let service: AuthRefreshService;
  let store: AuthSessionStore;

  beforeEach(() => {
    api.refresh.mockReset();
    TestBed.configureTestingModule({ providers: [{ provide: AuthApiService, useValue: api }] });
    service = TestBed.inject(AuthRefreshService);
    store = TestBed.inject(AuthSessionStore);
    store.loginSuccess({ tokenType: 'Bearer', accessToken: 'old', refreshToken: 'refresh-old', expiresIn: 60 });
  });

  it('comparte un único refresh entre solicitudes concurrentes y rota ambos tokens', async () => {
    const response = new Subject<AuthTokens>();
    api.refresh.mockReturnValue(response);
    const first = service.refreshOnce();
    const second = service.refreshOnce();
    const firstResult = firstValueFrom(first);
    const secondResult = firstValueFrom(second);

    expect(first).toBe(second);
    expect(api.refresh).toHaveBeenCalledOnce();
    response.next({ tokenType: 'Bearer', accessToken: 'new', refreshToken: 'refresh-new', expiresIn: 900 });
    response.complete();
    await Promise.all([firstResult, secondResult]);

    expect(store.accessToken()).toBe('new');
    expect(store.refreshToken()).toBe('refresh-new');
  });

  it('permite un intento posterior cuando el refresh falla', async () => {
    api.refresh.mockReturnValue(throwError(() => new Error('fallo')));
    await expect(firstValueFrom(service.refreshOnce())).rejects.toThrow('fallo');
    await expect(firstValueFrom(service.refreshOnce())).rejects.toThrow('fallo');
    expect(api.refresh).toHaveBeenCalledTimes(2);
  });
});
