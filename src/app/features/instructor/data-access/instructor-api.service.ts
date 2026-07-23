import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { PageResponse } from '../../../core/models/page-response.model';
import { normalizePageRequest, normalizePageResponse } from '../../../core/models/page-response.util';
import { InstructorTodayParams, InstructorTodayResponse } from '../models/instructor.models';

@Injectable({ providedIn: 'root' })
export class InstructorApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.instructor}`;

  today(params: InstructorTodayParams): Observable<PageResponse<InstructorTodayResponse>> {
    const requested = normalizePageRequest(params);
    const httpParams = new HttpParams().set('page', requested.page).set('size', requested.size);
    return this.http.get<PageResponse<InstructorTodayResponse>>(`${this.baseUrl}/today`, { params: httpParams })
      .pipe(map((page) => normalizePageResponse(page, requested)));
  }
}
