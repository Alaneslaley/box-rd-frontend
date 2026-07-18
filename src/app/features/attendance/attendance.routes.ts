import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/permissions';

export const ATTENDANCE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'today' },
  { path: 'today', title: 'Asistencia de hoy', data: { permissionsAny: [PERMISSIONS.ATTENDANCE_READ] }, loadComponent: () => import('./pages/attendance-today-page.component').then((m) => m.AttendanceTodayPageComponent) },
  { path: 'check-in', title: 'Registrar check-in', data: { permissionsAny: [PERMISSIONS.ATTENDANCE_CHECKIN] }, loadComponent: () => import('./pages/attendance-check-in-page.component').then((m) => m.AttendanceCheckInPageComponent) },
  { path: 'student/:studentId', title: 'Historial de asistencia', data: { permissionsAny: [PERMISSIONS.ATTENDANCE_STUDENT, PERMISSIONS.ATTENDANCE_READ] }, loadComponent: () => import('./pages/student-attendance-page.component').then((m) => m.StudentAttendancePageComponent) },
];
