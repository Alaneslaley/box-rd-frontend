import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { PageResponse } from '../../../core/models/page-response.model';
import { AttendancePageParams, AttendanceResponse, CheckInRequest, CheckInResponse, StudentAttendanceParams } from '../models/attendance.models';

@Injectable({ providedIn: 'root' })
export class AttendanceApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.attendance}`;

  checkIn(request: CheckInRequest): Observable<CheckInResponse> {
    return this.http.post<CheckInResponse>(`${this.baseUrl}/check-in`, request);
  }

  today(params: AttendancePageParams): Observable<PageResponse<AttendanceResponse>> {
    return this.http.get<PageResponse<AttendanceResponse>>(`${this.baseUrl}/today`, { params: this.pageParams(params) });
  }

  byStudent(params: StudentAttendanceParams): Observable<PageResponse<AttendanceResponse>> {
    return this.http.get<PageResponse<AttendanceResponse>>(`${this.baseUrl}/student/${encodeURIComponent(params.studentId)}`, { params: this.pageParams(params) });
  }

  private pageParams(params: AttendancePageParams): HttpParams {
    return new HttpParams().set('page', params.page).set('size', params.size);
  }
}
