import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/permissions';
import { permissionGuard } from '../../core/guards/permission.guard';

export const MEMBERSHIPS_ROUTES: Routes = [
  { path: '', title: 'Membresías', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.MEMBERSHIPS_VIEW] }, loadComponent: () => import('./pages/memberships-list-page.component').then((m) => m.MembershipsListPageComponent) },
  { path: 'new', title: 'Nueva membresía', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.MEMBERSHIPS_CREATE] }, loadComponent: () => import('./pages/membership-create-page.component').then((m) => m.MembershipCreatePageComponent) },
  { path: ':id/renew', title: 'Renovar membresía', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.MEMBERSHIPS_RENEW] }, loadComponent: () => import('./pages/membership-renew-page.component').then((m) => m.MembershipRenewPageComponent) },
];
