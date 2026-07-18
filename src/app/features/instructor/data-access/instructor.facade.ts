import { Injectable, inject, signal } from '@angular/core';
import { ApiError } from '../../../core/models/api-error.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { InstructorApiService } from './instructor-api.service';
import { InstructorTodayParams, InstructorTodayResponse } from '../models/instructor.models';

@Injectable({ providedIn: 'root' })
export class InstructorFacade {
  private readonly api = inject(InstructorApiService);
  private readonly queryState = signal<InstructorTodayParams>({ page: 0, size: 20 });
  readonly query = this.queryState.asReadonly();
  readonly page = signal<PageResponse<InstructorTodayResponse> | null>(null);
  readonly loading = signal(false);
  readonly error = signal<ApiError | null>(null);

  loadToday(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.today(this.queryState()).subscribe({
      next: (page) => { this.page.set(page); this.loading.set(false); },
      error: (error: ApiError) => { this.error.set(error); this.loading.set(false); },
    });
  }

  changePage(page: number): void {
    if (page < 0 || page === this.queryState().page) return;
    this.queryState.update((current) => ({ ...current, page }));
    this.loadToday();
  }
}
