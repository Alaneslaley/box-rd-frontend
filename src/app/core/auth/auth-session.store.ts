import { Injectable, computed, signal } from '@angular/core';
import { AuthUser, UserSession } from '../models/user-session.model';

const EMPTY_SESSION: UserSession = {
  authenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
};

@Injectable({ providedIn: 'root' })
export class AuthSessionStore {
  private readonly state = signal<UserSession>(EMPTY_SESSION);

  readonly session = this.state.asReadonly();
  readonly user = computed(() => this.state().user);
  readonly accessToken = computed(() => this.state().accessToken);
  readonly refreshToken = computed(() => this.state().refreshToken);
  readonly roles = computed(() => this.state().user?.roles ?? []);
  readonly permissions = computed(() => this.state().user?.permissions ?? []);
  readonly isAuthenticated = computed(() => this.state().authenticated);

  loginSuccess(session: Omit<UserSession, 'authenticated'>): void {
    this.state.set({ ...session, authenticated: Boolean(session.accessToken && session.user) });
  }

  logout(): void {
    this.clearSession();
  }

  clearSession(): void {
    this.state.set(EMPTY_SESSION);
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasAnyPermission(permissions: readonly string[]): boolean {
    return permissions.length === 0 || permissions.some((permission) => this.hasPermission(permission));
  }

  updateUser(user: AuthUser): void {
    this.state.update((current) => ({ ...current, user }));
  }
}
