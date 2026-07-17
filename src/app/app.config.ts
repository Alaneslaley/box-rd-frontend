import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { APP_CONFIG } from './core/config/app-config.token';
import { authTokenInterceptor } from './core/http/auth-token.interceptor';
import { httpErrorInterceptor } from './core/http/http-error.interceptor';
import { loadingInterceptor } from './core/http/loading.interceptor';
import { traceRequestInterceptor } from './core/http/trace-request.interceptor';
import { AuthFacade } from './core/auth/auth.facade';
import { AuthSessionStore } from './core/auth/auth-session.store';
import { EMPTY, catchError } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([traceRequestInterceptor, authTokenInterceptor, loadingInterceptor, httpErrorInterceptor])),
    provideClientHydration(),
    { provide: APP_CONFIG, useValue: environment },
    provideAppInitializer(() => {
      const auth = inject(AuthFacade);
      const session = inject(AuthSessionStore);
      auth.restoreSession();
      return session.isAuthenticated() ? auth.loadCurrentUser().pipe(catchError(() => EMPTY)) : undefined;
    }),
  ]
};
