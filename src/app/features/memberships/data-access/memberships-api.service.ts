import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { PageResponse } from '../../../core/models/page-response.model';
import { normalizePageRequest, normalizePageResponse } from '../../../core/models/page-response.util';
import { CreateMembershipRequest, MembershipSearchParams, MembershipSnapshot, RenewMembershipRequest } from '../models/membership.models';

@Injectable({ providedIn: 'root' })
export class MembershipsApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.memberships}`;

  list(params: MembershipSearchParams): Observable<PageResponse<MembershipSnapshot>> {
    const requested = normalizePageRequest(params);
    const httpParams = new HttpParams().set('page', requested.page).set('size', requested.size);
    return this.http.get<PageResponse<MembershipSnapshot>>(this.baseUrl, { params: httpParams })
      .pipe(map((page) => normalizePageResponse(page, requested)));
  }

  create(request: CreateMembershipRequest): Observable<MembershipSnapshot> { return this.http.post<MembershipSnapshot>(this.baseUrl, request); }
  renew(id: string, request: RenewMembershipRequest): Observable<MembershipSnapshot> { return this.http.post<MembershipSnapshot>(`${this.baseUrl}/${encodeURIComponent(id)}/renew`, request); }
  listByStudent(studentId: string): Observable<MembershipSnapshot[]> {
    return this.http.get<MembershipSnapshot[]>(`${this.baseUrl}/student/${encodeURIComponent(studentId)}`)
      .pipe(map((memberships) => Array.isArray(memberships) ? memberships : []));
  }
}
