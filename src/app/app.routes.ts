import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionChildGuard } from './core/guards/permission.guard';
import { AppShellComponent } from './core/layout/app-shell.component';
import { PERMISSIONS } from './core/auth/permissions';

const feature = (path: string, permissionsAny: string[], loader: () => Promise<Routes>): Routes[number] => ({ path, data: { permissionsAny }, loadChildren: loader });

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES) },
  { path: '', component: AppShellComponent, canActivate: [authGuard], canActivateChild: [permissionChildGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    feature('dashboard', [PERMISSIONS.DASHBOARD_VIEW], () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)),
    feature('students', [PERMISSIONS.STUDENTS_VIEW, PERMISSIONS.STUDENTS_CREATE, PERMISSIONS.STUDENTS_EDIT], () => import('./features/students/students.routes').then((m) => m.STUDENTS_ROUTES)),
    feature('memberships', [PERMISSIONS.MEMBERSHIPS_VIEW], () => import('./features/memberships/memberships.routes').then((m) => m.MEMBERSHIPS_ROUTES)),
    feature('payments', [PERMISSIONS.PAYMENTS_VIEW], () => import('./features/payments/payments.routes').then((m) => m.PAYMENTS_ROUTES)),
    feature('cash', [PERMISSIONS.CASH_VIEW], () => import('./features/cash/cash.routes').then((m) => m.CASH_ROUTES)),
    feature('attendance', [PERMISSIONS.ATTENDANCE_VIEW], () => import('./features/attendance/attendance.routes').then((m) => m.ATTENDANCE_ROUTES)),
    feature('reports', [PERMISSIONS.REPORTS_VIEW], () => import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES)),
    feature('security', [PERMISSIONS.SECURITY_VIEW], () => import('./features/security/security.routes').then((m) => m.SECURITY_ROUTES)),
    feature('sports', [PERMISSIONS.SPORTS_VIEW], () => import('./features/sports/sports.routes').then((m) => m.SPORTS_ROUTES)),
    { path: 'forbidden', title: 'Acceso no disponible', loadComponent: () => import('./features/forbidden/forbidden-page.component').then((m) => m.ForbiddenPageComponent) },
  ] },
  { path: '**', title: 'Página no encontrada', loadComponent: () => import('./features/not-found/not-found-page.component').then((m) => m.NotFoundPageComponent) },
];
