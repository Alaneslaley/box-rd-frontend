import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { RolesApiService } from './roles-api.service';
import { UsersApiService } from './users-api.service';
import { CreateUserRequest, RoleSnapshot, RolesRequest, StatusRequest, UserSnapshot, UsersSearchParams } from '../models/security.models';

@Injectable({ providedIn: 'root' })
export class SecurityFacade {
  private readonly usersApi = inject(UsersApiService);
  private readonly rolesApi = inject(RolesApiService);
  private readonly queryState = signal<UsersSearchParams>({ page: 0, size: 20 });
  readonly query = this.queryState.asReadonly();
  readonly usersPage = signal<PageResponse<UserSnapshot> | null>(null);
  readonly usersLoading = signal(false);
  readonly usersError = signal<ApiError | null>(null);
  readonly roles = signal<RoleSnapshot[]>([]);
  readonly rolesLoading = signal(false);
  readonly rolesError = signal<ApiError | null>(null);

  loadUsers(): void {
    this.usersLoading.set(true); this.usersError.set(null);
    this.usersApi.list(this.queryState()).subscribe({ next: (page) => { this.usersPage.set(page); this.usersLoading.set(false); }, error: (error: ApiError) => { this.usersError.set(error); this.usersLoading.set(false); } });
  }

  changeUsersPage(page: number): void {
    if (page < 0 || page === this.queryState().page) return;
    this.queryState.update((current) => ({ ...current, page })); this.loadUsers();
  }

  createUser(request: CreateUserRequest): Observable<UserSnapshot> { return this.usersApi.create(request); }
  updateUserStatus(id: string, request: StatusRequest): Observable<UserSnapshot> { return this.usersApi.updateStatus(id, request); }
  updateUserRoles(id: string, request: RolesRequest): Observable<UserSnapshot> { return this.usersApi.updateRoles(id, request); }

  loadRoles(): void {
    this.rolesLoading.set(true); this.rolesError.set(null);
    this.rolesApi.list().subscribe({ next: (roles) => { this.roles.set(roles); this.rolesLoading.set(false); }, error: (error: ApiError) => { this.rolesError.set(error); this.rolesLoading.set(false); } });
  }

  findUserFromCurrentPageOrState(id: string, state: unknown): UserSnapshot | null {
    const candidate = this.userFromState(state);
    if (candidate?.id === id) return candidate;
    return this.usersPage()?.content.find((user) => user.id === id) ?? null;
  }

  resolveUserFromCurrentPageOrState(id: string, state: unknown): Observable<UserSnapshot | null> {
    const current = this.findUserFromCurrentPageOrState(id, state);
    if (current) return of(current);
    return this.usersApi.list(this.queryState()).pipe(tap((page) => this.usersPage.set(page)), map((page) => page.content.find((user) => user.id === id) ?? null));
  }

  private userFromState(state: unknown): UserSnapshot | null {
    if (!state || typeof state !== 'object') return null;
    const candidate = (state as { user?: unknown }).user;
    return candidate && typeof candidate === 'object' && typeof (candidate as UserSnapshot).id === 'string' ? candidate as UserSnapshot : null;
  }
}
