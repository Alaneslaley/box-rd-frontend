import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthSessionStore } from '../auth/auth-session.store';
import { permissionGuard } from './permission.guard';

describe('permissionGuard', () => {
  const router = { createUrlTree: vi.fn(() => ({ redirected: true })) };
  beforeEach(() => TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] }));
  it('permite acceso cuando la sesión tiene alguno de los permisos', () => {
    TestBed.inject(AuthSessionStore).loginSuccess({ accessToken: 'token', user: { id: '1', roles: [], permissions: ['students.read'] } });
    const result = TestBed.runInInjectionContext(() => permissionGuard({ data: { permissionsAny: ['payments.read', 'students.read'] } } as never, {} as never));
    expect(result).toBe(true);
  });
  it('redirige a forbidden cuando falta el permiso visual', () => {
    TestBed.inject(AuthSessionStore).loginSuccess({ accessToken: 'token', user: { id: '1', roles: [], permissions: [] } });
    const result = TestBed.runInInjectionContext(() => permissionGuard({ data: { permissionsAny: ['students.read'] } } as never, {} as never));
    expect(result).toEqual({ redirected: true });
  });
});
