import { MenuItem } from '../models/menu-item.model';
import { PERMISSIONS } from '../auth/permissions';

export const APP_MENU: MenuItem[] = [
  { label: 'Dashboard', route: '/dashboard', permissionsAny: [PERMISSIONS.DASHBOARD_VIEW], phase: 'Fase 1' },
  { label: 'Alumnos', route: '/students', permissionsAny: [PERMISSIONS.STUDENTS_VIEW], phase: 'Fase 1' },
  { label: 'Membresías', route: '/memberships', permissionsAny: [PERMISSIONS.MEMBERSHIPS_VIEW], phase: 'Fase 1' },
  { label: 'Pagos', route: '/payments', permissionsAny: [PERMISSIONS.PAYMENTS_VIEW], phase: 'Fase 1' },
  { label: 'Caja', route: '/cash', permissionsAny: [PERMISSIONS.CASH_VIEW], phase: 'Fase 1' },
  { label: 'Asistencia', route: '/attendance', permissionsAny: [PERMISSIONS.ATTENDANCE_VIEW], phase: 'Fase 1' },
  { label: 'Reportes', route: '/reports', permissionsAny: [PERMISSIONS.REPORTS_VIEW], phase: 'Fase 1' },
  { label: 'Seguridad', route: '/security', permissionsAny: [PERMISSIONS.SECURITY_VIEW], phase: 'Fase 1' },
  { label: 'Deportivo', route: '/sports', permissionsAny: [PERMISSIONS.SPORTS_VIEW], phase: 'Fase 3' },
];
