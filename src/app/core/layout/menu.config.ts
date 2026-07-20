import { MenuItem } from '../models/menu-item.model';
import { PERMISSIONS } from '../auth/permissions';

export const APP_MENU: MenuItem[] = [
  { label: 'Dashboard', route: '/dashboard', permissionsAny: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.REPORTS_ADMIN_DASHBOARD] },
  { label: 'Alumnos', route: '/students', permissionsAny: [PERMISSIONS.STUDENTS_VIEW] },
  { label: 'Planes', route: '/plans', permissionsAny: [PERMISSIONS.PLANS_VIEW] },
  { label: 'Membresías', route: '/memberships', permissionsAny: [PERMISSIONS.MEMBERSHIPS_VIEW] },
  { label: 'Pagos', route: '/payments', permissionsAny: [PERMISSIONS.PAYMENTS_READ] },
  { label: 'Caja', route: '/cash', permissionsAny: [PERMISSIONS.CASH_READ] },
  { label: 'Asistencia', route: '/attendance', permissionsAny: [PERMISSIONS.ATTENDANCE_READ] },
  { label: 'Registrar check-in', route: '/attendance/check-in', permissionsAny: [PERMISSIONS.ATTENDANCE_CHECKIN] },
  { label: 'Instructor hoy', route: '/instructor/today', permissionsAny: [PERMISSIONS.INSTRUCTOR_TODAY, PERMISSIONS.ATTENDANCE_READ] },
  { label: 'Reportes', route: '/reports', permissionsAny: [PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_ADMIN_DASHBOARD] },
  { label: 'Seguridad', route: '/security', permissionsAny: [PERMISSIONS.SECURITY_READ, PERMISSIONS.USERS_READ] },
  { label: 'Deportivo', route: '/sports', permissionsAny: [PERMISSIONS.SPORTS_VIEW] },
];
