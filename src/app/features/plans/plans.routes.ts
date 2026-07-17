import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/permissions';
import { permissionGuard } from '../../core/guards/permission.guard';

export const PLANS_ROUTES: Routes = [
  { path: '', title: 'Planes', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.PLANS_VIEW] }, loadComponent: () => import('./pages/plans-list-page.component').then((m) => m.PlansListPageComponent) },
  { path: 'new', title: 'Nuevo plan', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.PLANS_CREATE] }, loadComponent: () => import('./pages/plan-create-page.component').then((m) => m.PlanCreatePageComponent) },
  { path: ':id/edit', title: 'Editar plan', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.PLANS_EDIT] }, loadComponent: () => import('./pages/plan-edit-page.component').then((m) => m.PlanEditPageComponent) },
];
