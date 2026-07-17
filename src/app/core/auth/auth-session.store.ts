import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthMeResponse, AuthSession } from '../models/user-session.model';
import { AuthTokens } from './auth-api.service';
import { AuthSessionStorageService } from './auth-session-storage.service';

const EMPTY_SESSION: AuthSession = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null, expiresAt: null,
};

@Injectable({ providedIn: 'root' })
export class AuthSessionStore {
  private readonly storage = inject(AuthSessionStorageService);
  private readonly state = signal<AuthSession>(EMPTY_SESSION);

  readonly session = this.state.asReadonly();
  readonly user = computed(() => this.state().user);
  readonly accessToken = computed(() => this.state().accessToken);
  readonly refreshToken = computed(() => this.state().refreshToken);
  readonly roles = computed(() => this.state().user?.roles ?? []);
  readonly permissions = computed(() => this.state().user?.permissions ?? []);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);

  loginSuccess(response: AuthTokens): void {
    const session: AuthSession = {
      isAuthenticated: Boolean(response.accessToken), accessToken: response.accessToken,
      refreshToken: response.refreshToken, user: this.state().user,
      expiresAt: Date.now() + response.expiresIn * 1000,
    };
    this.setSession(session);
  }

  logout(): void {
    this.clearSession();
  }

  clearSession(): void {
    this.state.set(EMPTY_SESSION);
    this.storage.clear();
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasAnyPermission(permissions: readonly string[]): boolean {
    return permissions.length === 0 || permissions.some((permission) => this.hasPermission(permission));
  }

  hasRole(role: string): boolean { return this.roles().includes(role); }
  hasAnyRole(roles: readonly string[]): boolean { return roles.some((role) => this.hasRole(role)); }

  setCurrentUser(user: AuthMeResponse): void {
    this.state.update((current) => ({ ...current, user }));
    this.persist();
  }

  restoreSession(): void {
    const session = this.storage.read();
    if (session) this.state.set(session); else this.storage.clear();
  }

  private setSession(session: AuthSession): void { this.state.set(session); this.persist(); }
  private persist(): void { this.storage.write(this.state()); }
}
