import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { AuthUser } from '../models/user-session.model';
import { AUTH_ENDPOINTS } from './auth-endpoints';

export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { accessToken: string; refreshToken?: string; user: AuthUser; }

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly url = (path: string) => `${this.config.apiBaseUrl}${path}`;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url(AUTH_ENDPOINTS.login), request);
  }
  refresh(): Observable<LoginResponse> { return this.http.post<LoginResponse>(this.url(AUTH_ENDPOINTS.refresh), {}); }
  logout(): Observable<void> { return this.http.post<void>(this.url(AUTH_ENDPOINTS.logout), {}); }
  me(): Observable<AuthUser> { return this.http.get<AuthUser>(this.url(AUTH_ENDPOINTS.me)); }
}
