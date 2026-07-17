import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';

export const AUTH_ROUTES: Routes = [{ path: 'login', title: 'Iniciar sesión', canActivate: [guestGuard], loadComponent: () => import('./login/login-page.component').then((m) => m.LoginPageComponent) }];
