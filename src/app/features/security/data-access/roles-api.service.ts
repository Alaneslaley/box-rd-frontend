import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { RoleSnapshot } from '../models/security.models';

@Injectable({ providedIn: 'root' })
export class RolesApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  list(): Observable<RoleSnapshot[]> { return this.http.get<RoleSnapshot[]>(`${this.config.apiBaseUrl}${API_ENDPOINTS.roles}`); }
}
