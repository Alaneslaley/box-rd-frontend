import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { AdminDashboardResponse } from '../models/report.models';

@Injectable({ providedIn: 'root' })
export class ReportsApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAdminDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(`${this.config.apiBaseUrl}${API_ENDPOINTS.reports.adminDashboard}`);
  }
}
