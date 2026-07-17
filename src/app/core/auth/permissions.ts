/**
 * Códigos visuales alineados con la arquitectura web. Confirmar el contrato
 * final con el backend antes de habilitar operaciones de cada módulo.
 */
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.read',
  STUDENTS_VIEW: 'students.read',
  STUDENTS_CREATE: 'students.create',
  STUDENTS_EDIT: 'students.update',
  MEMBERSHIPS_VIEW: 'memberships.read',
  MEMBERSHIPS_MANAGE: 'memberships.create',
  PAYMENTS_VIEW: 'payments.read',
  PAYMENTS_REGISTER: 'payments.create',
  CASH_VIEW: 'cash.read-current',
  CASH_OPEN: 'cash.open',
  CASH_CLOSE: 'cash.close',
  ATTENDANCE_VIEW: 'attendance.read',
  ATTENDANCE_REGISTER: 'attendance.check-in',
  REPORTS_VIEW: 'reports.admin.read',
  SECURITY_VIEW: 'users.read',
  SPORTS_VIEW: 'sports.dashboard.read',
} as const;
