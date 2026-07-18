import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { AttendanceApiService } from './attendance-api.service';

describe('AttendanceApiService', () => {
  let service: AttendanceApiService; let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] }); service = TestBed.inject(AttendanceApiService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());

  it('registra check-in con el body exacto', () => { service.checkIn({ studentId: 'student-id' }).subscribe(); const request = http.expectOne('/api/v1/attendance/check-in'); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual({ studentId: 'student-id' }); request.flush({}); });
  it('consulta hoy con page y size', () => { service.today({ page: 2, size: 25 }).subscribe(); const request = http.expectOne((candidate) => candidate.url === '/api/v1/attendance/today'); expect(request.request.params.get('page')).toBe('2'); expect(request.request.params.get('size')).toBe('25'); request.flush({ content: [], page: 2, size: 25, totalElements: 0, totalPages: 0, first: false, last: true }); });
  it('consulta historial codificando el studentId', () => { service.byStudent({ studentId: 'student/id', page: 1, size: 10 }).subscribe(); const request = http.expectOne((candidate) => candidate.url === '/api/v1/attendance/student/student%2Fid'); expect(request.request.params.get('page')).toBe('1'); expect(request.request.params.get('size')).toBe('10'); request.flush({ content: [], page: 1, size: 10, totalElements: 0, totalPages: 0, first: false, last: true }); });
});
