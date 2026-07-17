import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { PlansApiService } from './plans-api.service';

describe('PlansApiService', () => {
  let service: PlansApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] });
    service = TestBed.inject(PlansApiService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('envía paginación e includeInactive al listar', () => {
    service.list({ page: 2, size: 15, includeInactive: true }).subscribe();
    const request = http.expectOne((candidate) => candidate.url === '/api/v1/plans');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('15');
    expect(request.request.params.get('includeInactive')).toBe('true');
    request.flush({ content: [], page: 2, size: 15, totalElements: 0, totalPages: 0, first: false, last: true });
  });

  it('crea un plan con el body exacto', () => {
    const body = { name: 'Mensual', type: 'MONTHLY' as const, price: 900, currency: 'MXN', validityDays: 30 };
    service.create(body).subscribe();
    const request = http.expectOne('/api/v1/plans');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush({});
  });

  it('actualiza un plan sin inventar un endpoint de detalle', () => {
    const body = { name: 'Mensual', price: 950, currency: 'MXN', validityDays: 30, status: 'ACTIVO' as const };
    service.update('plan-id', body).subscribe();
    const request = http.expectOne('/api/v1/plans/plan-id');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(body);
    request.flush({});
  });
});
