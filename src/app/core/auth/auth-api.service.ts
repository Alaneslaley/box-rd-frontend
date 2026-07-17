import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { AuthMeResponse, AuthUser } from '../models/user-session.model';
import { AUTH_ENDPOINTS } from './auth-endpoints';

export interface LoginRequest { usernameOrEmail: string; password: string; }
export interface LoginResponse { accessToken: string; refreshToken?: string; tokenType?: string; expiresIn?: number; user?: AuthUser; }

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly url = (path: string) => `${this.config.apiBaseUrl}${path}`;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url(AUTH_ENDPOINTS.login), request);
  }
  refresh(refreshToken: string): Observable<LoginResponse> { return this.http.post<LoginResponse>(this.url(AUTH_ENDPOINTS.refresh), { refreshToken }); }
  logout(): Observable<void> { return this.http.post<void>(this.url(AUTH_ENDPOINTS.logout), {}); }
  me(): Observable<AuthMeResponse> { return this.http.get<AuthMeResponse>(this.url(AUTH_ENDPOINTS.me)); }
}
