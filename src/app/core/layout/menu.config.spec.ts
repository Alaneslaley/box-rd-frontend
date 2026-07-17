import { PERMISSIONS } from '../auth/permissions';
import { MEMBERSHIPS_ROUTES } from '../../features/memberships/memberships.routes';
import { PLANS_ROUTES } from '../../features/plans/plans.routes';
import { APP_MENU } from './menu.config';

describe('menú y permisos de Sprint 3', () => {
  it('muestra Planes y Membresías solo con sus permisos de consulta', () => {
    expect(APP_MENU.find((item) => item.route === '/plans')?.permissionsAny).toEqual([PERMISSIONS.PLANS_VIEW]);
    expect(APP_MENU.find((item) => item.route === '/memberships')?.permissionsAny).toEqual([PERMISSIONS.MEMBERSHIPS_VIEW]);
  });

  it('protege alta y edición de planes con los códigos reales', () => {
    expect(PLANS_ROUTES.find((route) => route.path === 'new')?.data?.['permissionsAny']).toEqual([PERMISSIONS.PLANS_CREATE]);
    expect(PLANS_ROUTES.find((route) => route.path === ':id/edit')?.data?.['permissionsAny']).toEqual([PERMISSIONS.PLANS_EDIT]);
  });

  it('protege alta y renovación de membresías con los códigos reales', () => {
    expect(MEMBERSHIPS_ROUTES.find((route) => route.path === 'new')?.data?.['permissionsAny']).toEqual([PERMISSIONS.MEMBERSHIPS_CREATE]);
    expect(MEMBERSHIPS_ROUTES.find((route) => route.path === ':id/renew')?.data?.['permissionsAny']).toEqual([PERMISSIONS.MEMBERSHIPS_RENEW]);
  });
});
