import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthSessionStore } from '../auth/auth-session.store';

export const authGuard: CanActivateFn = (_route, state) => inject(AuthSessionStore).isAuthenticated()
  ? true
  : inject(Router).createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
