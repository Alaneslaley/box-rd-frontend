import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/permissions';
import { permissionGuard } from '../../core/guards/permission.guard';

export const CASH_ROUTES: Routes = [
  { path: '', title: 'Caja', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.CASH_READ] }, loadComponent: () => import('./cash-page.component').then((m) => m.CashPageComponent) },
  { path: 'open', title: 'Abrir caja', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.CASH_OPEN] }, loadComponent: () => import('./pages/cash-open-page.component').then((m) => m.CashOpenPageComponent) },
  { path: 'close', title: 'Cerrar caja', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.CASH_CLOSE] }, loadComponent: () => import('./pages/cash-close-page.component').then((m) => m.CashClosePageComponent) },
];
