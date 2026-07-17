import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { AuthMeResponse } from '../models/user-session.model';
import { AUTH_ENDPOINTS } from './auth-endpoints';

export interface LoginRequest { email: string; password: string; device?: string; }
export interface AuthTokens { tokenType: 'Bearer' | string; accessToken: string; expiresIn: number; refreshToken: string; }
/** Alias temporal conservado para minimizar cambios de consumidores internos. */
export type LoginResponse = AuthTokens;

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly url = (path: string) => `${this.config.apiBaseUrl}${path}`;

  login(request: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(this.url(AUTH_ENDPOINTS.login), request);
  }
  refresh(refreshToken: string): Observable<AuthTokens> { return this.http.post<AuthTokens>(this.url(AUTH_ENDPOINTS.refresh), { refreshToken }); }
  logout(refreshToken: string): Observable<void> { return this.http.post<void>(this.url(AUTH_ENDPOINTS.logout), { refreshToken }); }
  me(): Observable<AuthMeResponse> { return this.http.get<AuthMeResponse>(this.url(AUTH_ENDPOINTS.me)); }
}
