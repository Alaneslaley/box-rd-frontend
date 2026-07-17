import { HttpContextToken } from '@angular/common/http';

/** Evita más de un reintento después de renovar el access token. */
export const AUTH_REQUEST_RETRIED = new HttpContextToken<boolean>(() => false);
