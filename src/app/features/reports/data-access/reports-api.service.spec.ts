import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { ReportsApiService } from './reports-api.service';

describe('ReportsApiService', () => {
  it('consulta GET /reports/admin/dashboard', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] });
    const service = TestBed.inject(ReportsApiService); const http = TestBed.inject(HttpTestingController);
    service.getAdminDashboard().subscribe();
    const request = http.expectOne('/api/v1/reports/admin/dashboard'); expect(request.request.method).toBe('GET'); request.flush({}); http.verify();
  });
});
