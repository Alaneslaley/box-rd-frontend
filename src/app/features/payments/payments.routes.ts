import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/permissions';
import { permissionGuard } from '../../core/guards/permission.guard';

export const PAYMENTS_ROUTES: Routes = [
  { path: '', title: 'Pagos', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.PAYMENTS_READ] }, loadComponent: () => import('./pages/payments-list-page.component').then((m) => m.PaymentsListPageComponent) },
  { path: 'new', title: 'Registrar pago', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.PAYMENTS_REGISTER] }, loadComponent: () => import('./pages/payment-create-page.component').then((m) => m.PaymentCreatePageComponent) },
  { path: ':id/receipt', title: 'Recibo de pago', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.PAYMENTS_RECEIPT, PERMISSIONS.PAYMENTS_DETAIL] }, loadComponent: () => import('./pages/payment-receipt-page.component').then((m) => m.PaymentReceiptPageComponent) },
  { path: ':id', title: 'Detalle de pago', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.PAYMENTS_DETAIL, PERMISSIONS.PAYMENTS_READ] }, loadComponent: () => import('./pages/payment-detail-page.component').then((m) => m.PaymentDetailPageComponent) },
];
