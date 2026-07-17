import { Routes } from '@angular/router';
export const MEMBERSHIPS_ROUTES: Routes = [{ path: '', title: 'Membresías', loadComponent: () => import('./memberships-page.component').then((m) => m.MembershipsPageComponent) }];
