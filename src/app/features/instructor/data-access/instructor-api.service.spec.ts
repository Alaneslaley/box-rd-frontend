import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { InstructorApiService } from './instructor-api.service';

describe('InstructorApiService', () => {
  it('consulta instructor hoy con paginación', () => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] }); const service = TestBed.inject(InstructorApiService); const http = TestBed.inject(HttpTestingController); service.today({ page: 3, size: 15 }).subscribe(); const request = http.expectOne((candidate) => candidate.url === '/api/v1/instructor/today'); expect(request.request.method).toBe('GET'); expect(request.request.params.get('page')).toBe('3'); expect(request.request.params.get('size')).toBe('15'); request.flush({ content: [], page: 3, size: 15, totalElements: 0, totalPages: 0, first: false, last: true }); http.verify(); });
});
