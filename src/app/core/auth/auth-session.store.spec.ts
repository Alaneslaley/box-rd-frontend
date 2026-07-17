import { TestBed } from '@angular/core/testing';
import { AuthSessionStore } from './auth-session.store';

describe('AuthSessionStore', () => {
  let store: AuthSessionStore;
  beforeEach(() => { TestBed.configureTestingModule({}); store = TestBed.inject(AuthSessionStore); });
  it('expone sesión y permisos después de loginSuccess', () => {
    store.loginSuccess({ tokenType: 'Bearer', accessToken: 'token', refreshToken: 'refresh', expiresIn: 900 });
    store.setCurrentUser({ id: '1', branchId: null, email: 'admin@gymbox.mx', firstName: 'Admin', lastName: 'GymBox', status: 'ACTIVO', mustChangePassword: false, authzVersion: 1, roles: ['ADMINISTRADOR'], permissions: ['ALUMNOS_CONSULTAR'] });
    expect(store.isAuthenticated()).toBe(true); expect(store.hasPermission('ALUMNOS_CONSULTAR')).toBe(true); expect(store.hasAnyPermission(['PAGOS_CONSULTAR', 'ALUMNOS_CONSULTAR'])).toBe(true);
  });
  it('limpia información sensible al cerrar sesión', () => { store.loginSuccess({ tokenType: 'Bearer', accessToken: 'token', refreshToken: 'refresh', expiresIn: 900 }); store.logout(); expect(store.session().accessToken).toBeNull(); expect(store.user()).toBeNull(); });
});
