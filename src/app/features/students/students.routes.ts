import { Routes } from '@angular/router';
export const STUDENTS_ROUTES: Routes = [{ path: '', title: 'Alumnos', loadComponent: () => import('./students-page.component').then((m) => m.StudentsPageComponent) }];
