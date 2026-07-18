import { MenuItem } from '../models/menu-item.model';
import { PERMISSIONS } from '../auth/permissions';

export const APP_MENU: MenuItem[] = [
  { label: 'Dashboard', route: '/dashboard', permissionsAny: [PERMISSIONS.DASHBOARD_VIEW], phase: 'Fase 1' },
  { label: 'Alumnos', route: '/students', permissionsAny: [PERMISSIONS.STUDENTS_VIEW], phase: 'Fase 1' },
  { label: 'Planes', route: '/plans', permissionsAny: [PERMISSIONS.PLANS_VIEW], phase: 'Fase 1' },
  { label: 'Membresías', route: '/memberships', permissionsAny: [PERMISSIONS.MEMBERSHIPS_VIEW], phase: 'Fase 1' },
  { label: 'Pagos', route: '/payments', permissionsAny: [PERMISSIONS.PAYMENTS_READ], phase: 'Fase 1' },
  { label: 'Caja', route: '/cash', permissionsAny: [PERMISSIONS.CASH_READ], phase: 'Fase 1' },
  { label: 'Asistencia', route: '/attendance', permissionsAny: [PERMISSIONS.ATTENDANCE_READ], phase: 'Sprint 5' },
  { label: 'Registrar check-in', route: '/attendance/check-in', permissionsAny: [PERMISSIONS.ATTENDANCE_CHECKIN], phase: 'Sprint 5' },
  { label: 'Instructor hoy', route: '/instructor/today', permissionsAny: [PERMISSIONS.INSTRUCTOR_TODAY, PERMISSIONS.ATTENDANCE_READ], phase: 'Sprint 5' },
  { label: 'Reportes', route: '/reports', permissionsAny: [PERMISSIONS.REPORTS_VIEW], phase: 'Fase 1' },
  { label: 'Seguridad', route: '/security', permissionsAny: [PERMISSIONS.SECURITY_VIEW], phase: 'Fase 1' },
  { label: 'Deportivo', route: '/sports', permissionsAny: [PERMISSIONS.SPORTS_VIEW], phase: 'Fase 3' },
];
