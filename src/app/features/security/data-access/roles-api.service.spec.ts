import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { RolesApiService } from './roles-api.service';

describe('RolesApiService', () => {
  it('consulta GET /roles', () => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] }); const service = TestBed.inject(RolesApiService); const http = TestBed.inject(HttpTestingController); service.list().subscribe(); const request = http.expectOne('/api/v1/roles'); expect(request.request.method).toBe('GET'); request.flush([]); http.verify(); });
});
