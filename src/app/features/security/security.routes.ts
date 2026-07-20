import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';
import { PERMISSIONS } from '../../core/auth/permissions';

export const SECURITY_ROUTES: Routes = [
  { path: '', title: 'Seguridad administrativa', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.SECURITY_READ, PERMISSIONS.USERS_READ] }, loadComponent: () => import('./pages/security-home-page.component').then((m) => m.SecurityHomePageComponent) },
  { path: 'users', title: 'Usuarios', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.USERS_READ] }, loadComponent: () => import('./pages/users-list-page.component').then((m) => m.UsersListPageComponent) },
  { path: 'users/new', title: 'Nuevo usuario', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.USERS_CREATE] }, loadComponent: () => import('./pages/user-create-page.component').then((m) => m.UserCreatePageComponent) },
  { path: 'users/:id/roles', title: 'Asignar roles', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.USERS_ROLES] }, loadComponent: () => import('./pages/user-roles-page.component').then((m) => m.UserRolesPageComponent) },
  { path: 'users/:id/status', title: 'Cambiar estado', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.USERS_STATUS] }, loadComponent: () => import('./pages/user-status-page.component').then((m) => m.UserStatusPageComponent) },
  { path: 'users/:id', title: 'Detalle de usuario', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.USERS_READ] }, loadComponent: () => import('./pages/user-detail-page.component').then((m) => m.UserDetailPageComponent) },
  { path: 'roles', title: 'Roles disponibles', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.ROLES_READ] }, loadComponent: () => import('./pages/roles-list-page.component').then((m) => m.RolesListPageComponent) },
];
