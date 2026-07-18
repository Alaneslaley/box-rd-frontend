import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/permissions';

export const DASHBOARD_ROUTES: Routes = [
  { path: '', title: 'Dashboard administrativo', data: { permissionsAny: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.REPORTS_ADMIN_DASHBOARD] }, loadComponent: () => import('./dashboard-page.component').then((m) => m.DashboardPageComponent) },
];
