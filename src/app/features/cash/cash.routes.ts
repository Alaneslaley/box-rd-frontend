import { Routes } from '@angular/router';
export const CASH_ROUTES: Routes = [{ path: '', title: 'Caja', loadComponent: () => import('./cash-page.component').then((m) => m.CashPageComponent) }];
