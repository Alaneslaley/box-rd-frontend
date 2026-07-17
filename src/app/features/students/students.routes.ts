import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';
import { PERMISSIONS } from '../../core/auth/permissions';

export const STUDENTS_ROUTES: Routes = [
  { path: '', title: 'Alumnos', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.STUDENTS_VIEW] }, loadComponent: () => import('./pages/students-list-page.component').then((m) => m.StudentsListPageComponent) },
  { path: 'new', title: 'Nuevo alumno', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.STUDENTS_CREATE] }, loadComponent: () => import('./pages/student-create-page.component').then((m) => m.StudentCreatePageComponent) },
  { path: ':id/edit', title: 'Editar alumno', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.STUDENTS_EDIT] }, loadComponent: () => import('./pages/student-edit-page.component').then((m) => m.StudentEditPageComponent) },
  { path: ':id', title: 'Detalle de alumno', canActivate: [permissionGuard], data: { permissionsAny: [PERMISSIONS.STUDENTS_DETAIL] }, loadComponent: () => import('./pages/student-detail-page.component').then((m) => m.StudentDetailPageComponent) },
];
