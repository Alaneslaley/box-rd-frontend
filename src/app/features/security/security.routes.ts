import { Routes } from '@angular/router';
export const SECURITY_ROUTES: Routes = [{ path: '', title: 'Seguridad', loadComponent: () => import('./security-page.component').then((m) => m.SecurityPageComponent) }];
