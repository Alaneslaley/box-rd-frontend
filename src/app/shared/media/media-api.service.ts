import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { API_ENDPOINTS } from '../../core/config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class MediaApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}${API_ENDPOINTS.media}`;

  /** Descarga autenticada: el token lo agrega el interceptor, nunca se incluye en la URL. */
  getBlob(fileId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${encodeURIComponent(fileId)}`, { responseType: 'blob' });
  }
}
