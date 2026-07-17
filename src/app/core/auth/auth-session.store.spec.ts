import { TestBed } from '@angular/core/testing';
import { AuthSessionStore } from './auth-session.store';

describe('AuthSessionStore', () => {
  let store: AuthSessionStore;
  beforeEach(() => { TestBed.configureTestingModule({}); store = TestBed.inject(AuthSessionStore); });
  it('expone sesión y permisos después de loginSuccess', () => {
    store.loginSuccess({ accessToken: 'token', refreshToken: null, user: { id: '1', username: 'admin', fullName: 'Admin', roles: ['ADMIN'], permissions: ['students.read'] } });
    expect(store.isAuthenticated()).toBe(true); expect(store.hasPermission('students.read')).toBe(true); expect(store.hasAnyPermission(['payments.read', 'students.read'])).toBe(true);
  });
  it('limpia información sensible al cerrar sesión', () => { store.loginSuccess({ accessToken: 'token', refreshToken: 'refresh', user: { id: '1', username: 'admin', fullName: 'Admin', roles: [], permissions: [] } }); store.logout(); expect(store.session().accessToken).toBeNull(); expect(store.user()).toBeNull(); });
});
