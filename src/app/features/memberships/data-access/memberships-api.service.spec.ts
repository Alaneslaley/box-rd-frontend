import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { MembershipsApiService } from './memberships-api.service';

describe('MembershipsApiService', () => {
  let service: MembershipsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] });
    service = TestBed.inject(MembershipsApiService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('lista membresías con paginación', () => { service.list({ page: 1, size: 20 }).subscribe(); const request = http.expectOne((candidate) => candidate.url === '/api/v1/memberships'); expect(request.request.params.get('page')).toBe('1'); expect(request.request.params.get('size')).toBe('20'); request.flush({ content: [], page: 1, size: 20, totalElements: 0, totalPages: 0, first: false, last: true }); });
  it('crea una membresía', () => { const body = { studentId: 'student-id', planId: 'plan-id', startDate: '2026-07-17' }; service.create(body).subscribe(); const request = http.expectOne('/api/v1/memberships'); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(body); request.flush({}); });
  it('renueva por el endpoint documentado', () => { const body = { effectiveOn: '2026-08-01' }; service.renew('membership-id', body).subscribe(); const request = http.expectOne('/api/v1/memberships/membership-id/renew'); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(body); request.flush({}); });
  it('consulta el historial de un alumno', () => { service.listByStudent('student/id').subscribe(); const request = http.expectOne('/api/v1/memberships/student/student%2Fid'); expect(request.request.method).toBe('GET'); request.flush([]); });
});
