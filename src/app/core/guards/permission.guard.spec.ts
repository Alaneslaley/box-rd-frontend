import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthSessionStore } from '../auth/auth-session.store';
import { permissionGuard } from './permission.guard';

describe('permissionGuard', () => {
  const router = { createUrlTree: vi.fn(() => ({ redirected: true })) };
  beforeEach(() => TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] }));
  it('permite acceso cuando la sesión tiene alguno de los permisos', () => {
    const store = TestBed.inject(AuthSessionStore);
    store.loginSuccess({ tokenType: 'Bearer', accessToken: 'token', refreshToken: 'refresh', expiresIn: 900 });
    store.setCurrentUser({ id: '1', branchId: null, email: 'admin@gymbox.mx', firstName: 'Admin', lastName: 'GymBox', status: 'ACTIVE', mustChangePassword: false, authzVersion: 1, roles: [], permissions: ['students.read'] });
    const result = TestBed.runInInjectionContext(() => permissionGuard({ data: { permissionsAny: ['payments.read', 'students.read'] } } as never, {} as never));
    expect(result).toBe(true);
  });
  it('redirige a forbidden cuando falta el permiso visual', () => {
    const store = TestBed.inject(AuthSessionStore);
    store.loginSuccess({ tokenType: 'Bearer', accessToken: 'token', refreshToken: 'refresh', expiresIn: 900 });
    store.setCurrentUser({ id: '1', branchId: null, email: 'admin@gymbox.mx', firstName: 'Admin', lastName: 'GymBox', status: 'ACTIVE', mustChangePassword: false, authzVersion: 1, roles: [], permissions: [] });
    const result = TestBed.runInInjectionContext(() => permissionGuard({ data: { permissionsAny: ['students.read'] } } as never, {} as never));
    expect(result).toEqual({ redirected: true });
  });
});
