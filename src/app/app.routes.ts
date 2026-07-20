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
    feature('dashboard', [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.REPORTS_ADMIN_DASHBOARD], () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)),
    feature('students', [PERMISSIONS.STUDENTS_VIEW, PERMISSIONS.STUDENTS_CREATE, PERMISSIONS.STUDENTS_EDIT], () => import('./features/students/students.routes').then((m) => m.STUDENTS_ROUTES)),
    feature('plans', [PERMISSIONS.PLANS_VIEW, PERMISSIONS.PLANS_CREATE, PERMISSIONS.PLANS_EDIT], () => import('./features/plans/plans.routes').then((m) => m.PLANS_ROUTES)),
    feature('memberships', [PERMISSIONS.MEMBERSHIPS_VIEW, PERMISSIONS.MEMBERSHIPS_CREATE, PERMISSIONS.MEMBERSHIPS_RENEW], () => import('./features/memberships/memberships.routes').then((m) => m.MEMBERSHIPS_ROUTES)),
    feature('payments', [PERMISSIONS.PAYMENTS_READ, PERMISSIONS.PAYMENTS_REGISTER], () => import('./features/payments/payments.routes').then((m) => m.PAYMENTS_ROUTES)),
    feature('cash', [PERMISSIONS.CASH_READ, PERMISSIONS.CASH_OPEN, PERMISSIONS.CASH_CLOSE], () => import('./features/cash/cash.routes').then((m) => m.CASH_ROUTES)),
    feature('attendance', [PERMISSIONS.ATTENDANCE_READ, PERMISSIONS.ATTENDANCE_CHECKIN], () => import('./features/attendance/attendance.routes').then((m) => m.ATTENDANCE_ROUTES)),
    feature('instructor', [PERMISSIONS.INSTRUCTOR_TODAY, PERMISSIONS.ATTENDANCE_READ], () => import('./features/instructor/instructor.routes').then((m) => m.INSTRUCTOR_ROUTES)),
    feature('reports', [PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_ADMIN_DASHBOARD], () => import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES)),
    feature('security', [PERMISSIONS.SECURITY_READ, PERMISSIONS.USERS_READ], () => import('./features/security/security.routes').then((m) => m.SECURITY_ROUTES)),
    feature('sports', [PERMISSIONS.SPORTS_VIEW], () => import('./features/sports/sports.routes').then((m) => m.SPORTS_ROUTES)),
    { path: 'forbidden', title: 'Acceso no disponible', loadComponent: () => import('./features/forbidden/forbidden-page.component').then((m) => m.ForbiddenPageComponent) },
  ] },
  { path: '**', title: 'Página no encontrada', loadComponent: () => import('./features/not-found/not-found-page.component').then((m) => m.NotFoundPageComponent) },
];
