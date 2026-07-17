import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { StudentsApiService } from './students-api.service';

describe('StudentsApiService', () => {
  let service: StudentsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] });
    service = TestBed.inject(StudentsApiService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('construye la paginación soportada sin enviar filtros aún no aceptados por backend', () => {
    service.search({ page: 2, size: 15, search: 'Ana', level: 'BEGINNER', sort: 'fullName,asc' }).subscribe();
    const request = http.expectOne((candidate) => candidate.url === '/api/v1/students');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('15');
    expect(request.request.params.has('search')).toBe(false);
    expect(request.request.params.has('level')).toBe(false);
    expect(request.request.params.has('sort')).toBe(false);
    request.flush({ content: [], page: 2, size: 15, totalElements: 0, totalPages: 0, first: false, last: true });
  });
});
