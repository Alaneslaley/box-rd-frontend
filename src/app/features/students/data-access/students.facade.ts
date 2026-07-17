import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { StudentsApiService } from './students-api.service';
import { StudentCreateRequest, StudentResponse, StudentSearchParams, StudentSummaryResponse, StudentUpdateRequest } from '../models/student.models';

const INITIAL_FILTERS: StudentSearchParams = { page: 0, size: 20, search: '', level: '' };

@Injectable({ providedIn: 'root' })
export class StudentsFacade {
  private readonly api = inject(StudentsApiService);
  private readonly pageState = signal<PageResponse<StudentSummaryResponse> | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<ApiError | null>(null);
  private readonly filtersState = signal<StudentSearchParams>(INITIAL_FILTERS);

  readonly page = this.pageState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly filters = this.filtersState.asReadonly();
  readonly students = computed(() => {
    const content = this.pageState()?.content ?? [];
    const search = this.filtersState().search?.trim().toLocaleLowerCase('es-MX') ?? '';
    const level = this.filtersState().level;
    return content.filter((student) => (!search || student.fullName.toLocaleLowerCase('es-MX').includes(search) || student.phone?.includes(search)) && (!level || student.level === level));
  });

  loadStudents(): void {
    this.loadingState.set(true);
    this.errorState.set(null);
    this.api.search(this.filtersState()).pipe(finalize(() => this.loadingState.set(false))).subscribe({
      next: (page) => this.pageState.set(page),
      error: (error: ApiError) => this.errorState.set(error),
    });
  }

  updateFilters(filters: Partial<Pick<StudentSearchParams, 'search' | 'level'>>): void {
    this.filtersState.update((current) => ({ ...current, ...filters }));
  }

  changePage(page: number): void {
    if (page < 0 || page === this.filtersState().page) return;
    this.filtersState.update((current) => ({ ...current, page }));
    this.loadStudents();
  }

  clearFilters(): void {
    const reloadFirstPage = this.filtersState().page !== 0;
    this.filtersState.update((current) => ({ ...current, page: 0, search: '', level: '' }));
    if (reloadFirstPage) this.loadStudents();
  }

  createStudent(request: StudentCreateRequest): Observable<StudentResponse> { return this.api.create(request); }
  updateStudent(id: string, request: StudentUpdateRequest): Observable<StudentResponse> { return this.api.update(id, request); }
  loadDetail(id: string): Observable<StudentResponse> { return this.api.getById(id); }
}
