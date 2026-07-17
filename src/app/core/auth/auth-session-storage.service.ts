import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthSession } from '../models/user-session.model';

const STORAGE_KEY = 'gymbox.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthSessionStorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  read(): AuthSession | null {
    if (!this.isBrowser) return null;
    try {
      const value = sessionStorage.getItem(STORAGE_KEY);
      if (!value) return null;
      const session = JSON.parse(value) as AuthSession;
      return session.accessToken && !this.isExpired(session) ? session : null;
    } catch { return null; }
  }

  write(session: AuthSession): void {
    if (!this.isBrowser) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  clear(): void {
    if (this.isBrowser) sessionStorage.removeItem(STORAGE_KEY);
  }

  private isExpired(session: AuthSession): boolean { return Boolean(session.expiresAt && session.expiresAt <= Date.now()); }
}
