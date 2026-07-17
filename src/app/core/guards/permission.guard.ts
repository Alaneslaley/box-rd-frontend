import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthSessionStore } from '../auth/auth-session.store';

function check(route: ActivatedRouteSnapshot): boolean | ReturnType<Router['createUrlTree']> {
  const required = route.data['permissionsAny'] as string[] | undefined;
  return !required?.length || inject(AuthSessionStore).hasAnyPermission(required)
    ? true
    : inject(Router).createUrlTree(['/forbidden']);
}

export const permissionGuard: CanActivateFn = (route) => check(route);
export const permissionChildGuard: CanActivateChildFn = (route) => check(route);
