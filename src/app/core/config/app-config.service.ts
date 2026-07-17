import { Injectable, inject } from '@angular/core';
import { APP_CONFIG } from './app-config.token';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  readonly config = inject(APP_CONFIG);
}
