import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { CreateMembershipRequest, MembershipSearchParams, MembershipSnapshot, RenewMembershipRequest } from '../models/membership.models';
import { MembershipsApiService } from './memberships-api.service';

const INITIAL_QUERY: MembershipSearchParams = { page: 0, size: 20 };

@Injectable({ providedIn: 'root' })
export class MembershipsFacade {
  private readonly api = inject(MembershipsApiService);
  private readonly pageState = signal<PageResponse<MembershipSnapshot> | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<ApiError | null>(null);
  private readonly queryState = signal<MembershipSearchParams>(INITIAL_QUERY);

  readonly page = this.pageState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadMemberships(): void {
    this.loadingState.set(true);
    this.errorState.set(null);
    this.api.list(this.queryState()).subscribe({
      next: (page) => { this.pageState.set(page); this.loadingState.set(false); },
      error: (error: ApiError) => { this.errorState.set(error); this.loadingState.set(false); },
    });
  }

  changePage(page: number): void {
    if (page < 0 || page === this.queryState().page) return;
    this.queryState.update((current) => ({ ...current, page }));
    this.loadMemberships();
  }

  createMembership(request: CreateMembershipRequest): Observable<MembershipSnapshot> { return this.api.create(request); }
  renewMembership(id: string, request: RenewMembershipRequest): Observable<MembershipSnapshot> { return this.api.renew(id, request); }
  listByStudent(studentId: string): Observable<MembershipSnapshot[]> { return this.api.listByStudent(studentId); }
}
