import { Routes } from '@angular/router';
export const ATTENDANCE_ROUTES: Routes = [{ path: '', title: 'Asistencia', loadComponent: () => import('./attendance-page.component').then((m) => m.AttendancePageComponent) }];
