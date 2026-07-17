import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthSessionStore } from '../auth/auth-session.store';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const router = { createUrlTree: vi.fn(() => ({ redirected: true })) };
  beforeEach(() => TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] }));
  it('redirecciona a login sin sesión', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, { url: '/students' } as never));
    expect(result).toEqual({ redirected: true }); expect(router.createUrlTree).toHaveBeenCalled();
  });
  it('permite la ruta con sesión', () => {
    TestBed.inject(AuthSessionStore).loginSuccess({ accessToken: 'token', refreshToken: null, user: { id: '1', username: 'admin', fullName: 'Admin', roles: [], permissions: [] } });
    expect(TestBed.runInInjectionContext(() => authGuard({} as never, { url: '/students' } as never))).toBe(true);
  });
});
