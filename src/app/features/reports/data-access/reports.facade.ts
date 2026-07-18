import { Injectable, inject, signal } from '@angular/core';
import { ApiError } from '../../../core/models/api-error.model';
import { ReportsApiService } from './reports-api.service';
import { AdminDashboardResponse } from '../models/report.models';

@Injectable({ providedIn: 'root' })
export class ReportsFacade {
  private readonly api = inject(ReportsApiService);
  readonly data = signal<AdminDashboardResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<ApiError | null>(null);
  readonly lastUpdatedAt = signal<string | null>(null);

  loadDashboard(): void {
    this.loading.set(true);
    this.clearError();
    this.api.getAdminDashboard().subscribe({
      next: (data) => { this.data.set(data); this.lastUpdatedAt.set(new Date().toISOString()); this.loading.set(false); },
      error: (error: ApiError) => { this.error.set(error); this.loading.set(false); },
    });
  }

  refreshDashboard(): void { this.loadDashboard(); }
  clearError(): void { this.error.set(null); }
}
