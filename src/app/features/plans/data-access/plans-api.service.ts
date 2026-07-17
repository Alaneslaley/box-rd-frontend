import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { PageResponse } from '../../../core/models/page-response.model';
import { CreatePlanRequest, PlanSearchParams, PlanSnapshot, UpdatePlanRequest } from '../models/plan.models';

@Injectable({ providedIn: 'root' })
export class PlansApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.plans}`;

  list(params: PlanSearchParams): Observable<PageResponse<PlanSnapshot>> {
    const httpParams = new HttpParams().set('page', params.page).set('size', params.size).set('includeInactive', params.includeInactive);
    return this.http.get<PageResponse<PlanSnapshot>>(this.baseUrl, { params: httpParams });
  }

  create(request: CreatePlanRequest): Observable<PlanSnapshot> { return this.http.post<PlanSnapshot>(this.baseUrl, request); }
  update(id: string, request: UpdatePlanRequest): Observable<PlanSnapshot> { return this.http.put<PlanSnapshot>(`${this.baseUrl}/${encodeURIComponent(id)}`, request); }
}
