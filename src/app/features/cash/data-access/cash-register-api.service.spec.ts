import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { CashRegisterApiService } from './cash-register-api.service';

describe('CashRegisterApiService', () => {
  let service: CashRegisterApiService;
  let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] }); service = TestBed.inject(CashRegisterApiService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());
  it('consulta caja actual', () => { service.current().subscribe(); const request = http.expectOne('/api/v1/cash-register/current'); expect(request.request.method).toBe('GET'); request.flush({}); });
  it('abre caja con el body exacto', () => { const body = { branchId: 'branch-id', initialCash: 500, currency: 'MXN' }; service.open(body).subscribe(); const request = http.expectOne('/api/v1/cash-register/open'); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(body); request.flush({}); });
  it('cierra caja con el body exacto', () => { const body = { countedCash: 750, currency: 'MXN', notes: 'Cierre' }; service.close(body).subscribe(); const request = http.expectOne('/api/v1/cash-register/close'); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(body); request.flush({}); });
});
