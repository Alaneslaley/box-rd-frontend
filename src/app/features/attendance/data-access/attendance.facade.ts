import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { AttendanceApiService } from './attendance-api.service';
import { AttendancePageParams, AttendanceResponse, CheckInRequest, CheckInResponse, StudentAttendanceParams } from '../models/attendance.models';

@Injectable({ providedIn: 'root' })
export class AttendanceFacade {
  private readonly api = inject(AttendanceApiService);
  private readonly queryState = signal<AttendancePageParams>({ page: 0, size: 20 });
  readonly query = this.queryState.asReadonly();
  readonly page = signal<PageResponse<AttendanceResponse> | null>(null);
  readonly loading = signal(false);
  readonly error = signal<ApiError | null>(null);
  readonly lastCheckIn = signal<CheckInResponse | null>(null);

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

  checkIn(request: CheckInRequest): Observable<CheckInResponse> {
    return this.api.checkIn(request).pipe(tap((result) => this.lastCheckIn.set(result)));
  }

  clearCheckInResult(): void { this.lastCheckIn.set(null); }
  loadByStudent(params: StudentAttendanceParams): Observable<PageResponse<AttendanceResponse>> { return this.api.byStudent(params); }
}
