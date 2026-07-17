import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthSessionStore } from '../auth/auth-session.store';

export const guestGuard: CanActivateFn = () => inject(AuthSessionStore).isAuthenticated()
  ? inject(Router).createUrlTree(['/dashboard'])
  : true;
