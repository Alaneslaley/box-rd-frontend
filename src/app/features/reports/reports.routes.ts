import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/permissions';

export const REPORTS_ROUTES: Routes = [
  { path: '', title: 'Reportes', data: { permissionsAny: [PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_ADMIN_DASHBOARD] }, loadComponent: () => import('./reports-page.component').then((m) => m.ReportsPageComponent) },
  { path: 'admin-dashboard', title: 'Reporte administrativo', data: { permissionsAny: [PERMISSIONS.REPORTS_ADMIN_DASHBOARD] }, loadComponent: () => import('./pages/admin-dashboard-report-page.component').then((m) => m.AdminDashboardReportPageComponent) },
];
