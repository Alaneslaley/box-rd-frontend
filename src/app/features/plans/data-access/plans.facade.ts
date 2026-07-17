import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { CreatePlanRequest, PlanSearchParams, PlanSnapshot, UpdatePlanRequest } from '../models/plan.models';
import { PlansApiService } from './plans-api.service';

const INITIAL_QUERY: PlanSearchParams = { page: 0, size: 20, includeInactive: false };

@Injectable({ providedIn: 'root' })
export class PlansFacade {
  private readonly api = inject(PlansApiService);
  private readonly pageState = signal<PageResponse<PlanSnapshot> | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<ApiError | null>(null);
  private readonly queryState = signal<PlanSearchParams>(INITIAL_QUERY);

  readonly page = this.pageState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly query = this.queryState.asReadonly();

  loadPlans(): void {
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
    this.loadPlans();
  }

  setIncludeInactive(includeInactive: boolean): void {
    this.queryState.update((current) => ({ ...current, page: 0, includeInactive }));
    this.loadPlans();
  }

  createPlan(request: CreatePlanRequest): Observable<PlanSnapshot> { return this.api.create(request); }
  updatePlan(id: string, request: UpdatePlanRequest): Observable<PlanSnapshot> { return this.api.update(id, request); }

  /** Fallback temporal: OpenAPI no publica GET /plans/{id}; busca en el catálogo permitido (máximo 100). */
  findPlanById(id: string): Observable<PlanSnapshot | null> {
    return this.api.list({ page: 0, size: 100, includeInactive: true }).pipe(
      tap((page) => this.pageState.set(page)),
      map((page) => page.content.find((plan) => plan.id === id) ?? null),
    );
  }
}
