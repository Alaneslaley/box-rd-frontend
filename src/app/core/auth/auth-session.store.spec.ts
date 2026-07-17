import { TestBed } from '@angular/core/testing';
import { AuthSessionStore } from './auth-session.store';

describe('AuthSessionStore', () => {
  let store: AuthSessionStore;
  beforeEach(() => { TestBed.configureTestingModule({}); store = TestBed.inject(AuthSessionStore); });
  it('expone sesión y permisos después de loginSuccess', () => {
    store.loginSuccess({ tokenType: 'Bearer', accessToken: 'token', refreshToken: 'refresh', expiresIn: 900 });
    store.setCurrentUser({ id: '1', branchId: null, email: 'admin@gymbox.mx', firstName: 'Admin', lastName: 'GymBox', status: 'ACTIVE', mustChangePassword: false, authzVersion: 1, roles: ['ADMIN'], permissions: ['students.read'] });
    expect(store.isAuthenticated()).toBe(true); expect(store.hasPermission('students.read')).toBe(true); expect(store.hasAnyPermission(['payments.read', 'students.read'])).toBe(true);
  });
  it('limpia información sensible al cerrar sesión', () => { store.loginSuccess({ tokenType: 'Bearer', accessToken: 'token', refreshToken: 'refresh', expiresIn: 900 }); store.logout(); expect(store.session().accessToken).toBeNull(); expect(store.user()).toBeNull(); });
});
