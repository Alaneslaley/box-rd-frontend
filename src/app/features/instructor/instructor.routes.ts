import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/permissions';

export const INSTRUCTOR_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'today' },
  { path: 'today', title: 'Instructor · Hoy', data: { permissionsAny: [PERMISSIONS.INSTRUCTOR_TODAY, PERMISSIONS.ATTENDANCE_READ] }, loadComponent: () => import('./pages/instructor-today-page.component').then((m) => m.InstructorTodayPageComponent) },
];
