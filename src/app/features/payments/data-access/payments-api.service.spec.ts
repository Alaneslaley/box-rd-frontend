import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { PaymentsApiService } from './payments-api.service';

describe('PaymentsApiService', () => {
  let service: PaymentsApiService;
  let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: '/api/v1', appName: 'GymBox', appVersion: 'test' } }] }); service = TestBed.inject(PaymentsApiService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());

  it('lista con page y size', () => { service.list({ page: 2, size: 25 }).subscribe(); const request = http.expectOne((candidate) => candidate.url === '/api/v1/payments'); expect(request.request.params.get('page')).toBe('2'); expect(request.request.params.get('size')).toBe('25'); request.flush({ content: [], page: 2, size: 25, totalElements: 0, totalPages: 0, first: false, last: true }); });
  it('consulta un pago por id', () => { service.getById('payment/id').subscribe(); const request = http.expectOne('/api/v1/payments/payment%2Fid'); expect(request.request.method).toBe('GET'); request.flush({}); });
  it('registra con Idempotency-Key y body exacto', () => { const body = { membershipId: 'membership-id', method: 'CASH' as const, effectiveOn: '2026-07-17' }; service.register(body, 'unique-key').subscribe(); const request = http.expectOne('/api/v1/payments'); expect(request.request.method).toBe('POST'); expect(request.request.headers.get('Idempotency-Key')).toBe('unique-key'); expect(request.request.body).toEqual(body); request.flush({}); });
  it('consulta el recibo por id de pago', () => { service.getReceipt('payment-id').subscribe(); const request = http.expectOne('/api/v1/payments/payment-id/receipt'); expect(request.request.method).toBe('GET'); request.flush({}); });
});
