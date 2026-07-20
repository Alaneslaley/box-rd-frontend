import { PERMISSIONS } from '../auth/permissions';
import { MEMBERSHIPS_ROUTES } from '../../features/memberships/memberships.routes';
import { PLANS_ROUTES } from '../../features/plans/plans.routes';
import { PAYMENTS_ROUTES } from '../../features/payments/payments.routes';
import { CASH_ROUTES } from '../../features/cash/cash.routes';
import { ATTENDANCE_ROUTES } from '../../features/attendance/attendance.routes';
import { INSTRUCTOR_ROUTES } from '../../features/instructor/instructor.routes';
import { DASHBOARD_ROUTES } from '../../features/dashboard/dashboard.routes';
import { REPORTS_ROUTES } from '../../features/reports/reports.routes';
import { SECURITY_ROUTES } from '../../features/security/security.routes';
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

  it('muestra Pagos y Caja con permisos de consulta', () => {
    expect(APP_MENU.find((item) => item.route === '/payments')?.permissionsAny).toEqual([PERMISSIONS.PAYMENTS_READ]);
    expect(APP_MENU.find((item) => item.route === '/cash')?.permissionsAny).toEqual([PERMISSIONS.CASH_READ]);
  });

  it('protege registro, recibo, apertura y cierre con permisos reales', () => {
    expect(PAYMENTS_ROUTES.find((route) => route.path === 'new')?.data?.['permissionsAny']).toEqual([PERMISSIONS.PAYMENTS_REGISTER]);
    expect(PAYMENTS_ROUTES.find((route) => route.path === ':id/receipt')?.data?.['permissionsAny']).toEqual([PERMISSIONS.PAYMENTS_RECEIPT, PERMISSIONS.PAYMENTS_DETAIL]);
    expect(CASH_ROUTES.find((route) => route.path === 'open')?.data?.['permissionsAny']).toEqual([PERMISSIONS.CASH_OPEN]);
    expect(CASH_ROUTES.find((route) => route.path === 'close')?.data?.['permissionsAny']).toEqual([PERMISSIONS.CASH_CLOSE]);
  });

  it('muestra asistencia, check-in e instructor con los permisos reales', () => {
    expect(APP_MENU.find((item) => item.route === '/attendance')?.permissionsAny).toEqual([PERMISSIONS.ATTENDANCE_READ]);
    expect(APP_MENU.find((item) => item.route === '/attendance/check-in')?.permissionsAny).toEqual([PERMISSIONS.ATTENDANCE_CHECKIN]);
    expect(APP_MENU.find((item) => item.route === '/instructor/today')?.permissionsAny).toEqual([PERMISSIONS.INSTRUCTOR_TODAY, PERMISSIONS.ATTENDANCE_READ]);
  });

  it('protege las rutas de asistencia e instructor', () => {
    expect(ATTENDANCE_ROUTES.find((route) => route.path === 'today')?.data?.['permissionsAny']).toEqual([PERMISSIONS.ATTENDANCE_READ]);
    expect(ATTENDANCE_ROUTES.find((route) => route.path === 'check-in')?.data?.['permissionsAny']).toEqual([PERMISSIONS.ATTENDANCE_CHECKIN]);
    expect(INSTRUCTOR_ROUTES.find((route) => route.path === 'today')?.data?.['permissionsAny']).toEqual([PERMISSIONS.INSTRUCTOR_TODAY, PERMISSIONS.ATTENDANCE_READ]);
  });

  it('muestra Dashboard y Reportes con los aliases del permiso real', () => {
    expect(APP_MENU.find((item) => item.route === '/dashboard')?.permissionsAny).toEqual([PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.REPORTS_ADMIN_DASHBOARD]);
    expect(APP_MENU.find((item) => item.route === '/reports')?.permissionsAny).toEqual([PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_ADMIN_DASHBOARD]);
  });

  it('protege el dashboard y el reporte administrativo', () => {
    expect(DASHBOARD_ROUTES.find((route) => route.path === '')?.data?.['permissionsAny']).toEqual([PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.REPORTS_ADMIN_DASHBOARD]);
    expect(REPORTS_ROUTES.find((route) => route.path === 'admin-dashboard')?.data?.['permissionsAny']).toEqual([PERMISSIONS.REPORTS_ADMIN_DASHBOARD]);
  });

  it('muestra Seguridad y protege las acciones de usuarios y roles', () => {
    expect(APP_MENU.find((item) => item.route === '/security')?.permissionsAny).toEqual([PERMISSIONS.SECURITY_READ, PERMISSIONS.USERS_READ]);
    expect(SECURITY_ROUTES.find((route) => route.path === 'users')?.data?.['permissionsAny']).toEqual([PERMISSIONS.USERS_READ]);
    expect(SECURITY_ROUTES.find((route) => route.path === 'users/new')?.data?.['permissionsAny']).toEqual([PERMISSIONS.USERS_CREATE]);
    expect(SECURITY_ROUTES.find((route) => route.path === 'users/:id/roles')?.data?.['permissionsAny']).toEqual([PERMISSIONS.USERS_ROLES]);
    expect(SECURITY_ROUTES.find((route) => route.path === 'users/:id/status')?.data?.['permissionsAny']).toEqual([PERMISSIONS.USERS_STATUS]);
    expect(SECURITY_ROUTES.find((route) => route.path === 'roles')?.data?.['permissionsAny']).toEqual([PERMISSIONS.ROLES_READ]);
  });
});
