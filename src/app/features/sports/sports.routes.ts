import { Routes } from '@angular/router';
export const SPORTS_ROUTES: Routes = [{ path: '', title: 'Deportivo', loadComponent: () => import('./sports-page.component').then((m) => m.SportsPageComponent) }];
