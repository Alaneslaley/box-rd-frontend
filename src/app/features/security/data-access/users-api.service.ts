import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { PageResponse } from '../../../core/models/page-response.model';
import { normalizePageRequest, normalizePageResponse } from '../../../core/models/page-response.util';
import { CreateUserRequest, RolesRequest, StatusRequest, UserSnapshot, UsersSearchParams } from '../models/security.models';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.users}`;

  list(params: UsersSearchParams): Observable<PageResponse<UserSnapshot>> {
    const requested = normalizePageRequest(params);
    const httpParams = new HttpParams().set('page', requested.page).set('size', requested.size);
    return this.http.get<PageResponse<UserSnapshot>>(this.baseUrl, { params: httpParams })
      .pipe(map((page) => normalizePageResponse(page, requested)));
  }

  create(request: CreateUserRequest): Observable<UserSnapshot> { return this.http.post<UserSnapshot>(this.baseUrl, request); }
  updateStatus(id: string, request: StatusRequest): Observable<UserSnapshot> { return this.http.patch<UserSnapshot>(`${this.baseUrl}/${encodeURIComponent(id)}/status`, request); }
  updateRoles(id: string, request: RolesRequest): Observable<UserSnapshot> { return this.http.put<UserSnapshot>(`${this.baseUrl}/${encodeURIComponent(id)}/roles`, request); }
}
