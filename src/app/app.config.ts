import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { APP_CONFIG } from './core/config/app-config.token';
import { authTokenInterceptor } from './core/http/auth-token.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { loadingInterceptor } from './core/http/loading.interceptor';
import { traceRequestInterceptor } from './core/http/trace-request.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([traceRequestInterceptor, authTokenInterceptor, loadingInterceptor, errorInterceptor])),
    provideClientHydration(),
    { provide: APP_CONFIG, useValue: environment },
  ]
};
