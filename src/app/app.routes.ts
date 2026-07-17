import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionChildGuard } from './core/guards/permission.guard';
import { AppShellComponent } from './core/layout/app-shell.component';

const feature = (path: string, permissionsAny: string[], loader: () => Promise<Routes>): Routes[number] => ({ path, data: { permissionsAny }, loadChildren: loader });

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES) },
  { path: '', component: AppShellComponent, canActivate: [authGuard], canActivateChild: [permissionChildGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    feature('dashboard', ['dashboard.read'], () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)),
    feature('students', ['students.read'], () => import('./features/students/students.routes').then((m) => m.STUDENTS_ROUTES)),
    feature('memberships', ['memberships.read'], () => import('./features/memberships/memberships.routes').then((m) => m.MEMBERSHIPS_ROUTES)),
    feature('payments', ['payments.read'], () => import('./features/payments/payments.routes').then((m) => m.PAYMENTS_ROUTES)),
    feature('cash', ['cash.read-current'], () => import('./features/cash/cash.routes').then((m) => m.CASH_ROUTES)),
    feature('attendance', ['attendance.read'], () => import('./features/attendance/attendance.routes').then((m) => m.ATTENDANCE_ROUTES)),
    feature('reports', ['reports.admin.read'], () => import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES)),
    feature('security', ['users.read'], () => import('./features/security/security.routes').then((m) => m.SECURITY_ROUTES)),
    feature('sports', ['sports.dashboard.read'], () => import('./features/sports/sports.routes').then((m) => m.SPORTS_ROUTES)),
    { path: 'forbidden', title: 'Acceso no disponible', loadComponent: () => import('./features/forbidden/forbidden-page.component').then((m) => m.ForbiddenPageComponent) },
  ] },
  { path: '**', title: 'Página no encontrada', loadComponent: () => import('./features/not-found/not-found-page.component').then((m) => m.NotFoundPageComponent) },
];
