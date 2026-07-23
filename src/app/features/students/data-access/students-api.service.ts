import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { PageResponse } from '../../../core/models/page-response.model';
import { normalizePageRequest, normalizePageResponse } from '../../../core/models/page-response.util';
import { StudentCreateRequest, StudentResponse, StudentSearchParams, StudentSummaryResponse, StudentUpdateRequest } from '../models/student.models';

@Injectable({ providedIn: 'root' })
export class StudentsApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.students}`;

  search(params: StudentSearchParams): Observable<PageResponse<StudentSummaryResponse>> {
    // El controller actual solo acepta page y size. search/level se aplican localmente en la facade.
    const requested = normalizePageRequest(params);
    const httpParams = new HttpParams().set('page', requested.page).set('size', requested.size);
    return this.http.get<PageResponse<StudentSummaryResponse>>(this.baseUrl, { params: httpParams })
      .pipe(map((page) => normalizePageResponse(page, requested)));
  }

  getById(id: string): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }

  create(request: StudentCreateRequest): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(this.baseUrl, request);
  }

  update(id: string, request: StudentUpdateRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.baseUrl}/${encodeURIComponent(id)}`, request);
  }
}
