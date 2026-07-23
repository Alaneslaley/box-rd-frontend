import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { IdempotencyKeyService } from '../../../core/http/idempotency-key.service';
import { MembershipsApiService } from '../../memberships/data-access/memberships-api.service';
import { PaymentsFacade } from '../data-access/payments.facade';
import { RegisterPaymentRequest } from '../models/payment.models';
import { PaymentCreatePageComponent } from './payment-create-page.component';

describe('PaymentCreatePageComponent idempotency', () => {
  const membershipsApi = {
    list: vi.fn(() => of({ content: [], page: 0, size: 100, totalElements: 0, totalPages: 0, first: true, last: true })),
  };
  const facade = { registerPayment: vi.fn() };
  const keys = { generate: vi.fn(() => 'attempt-key') };
  const router = { navigate: vi.fn(() => Promise.resolve(true)) };
  const route = { snapshot: { queryParamMap: { get: () => null } } };
  let fixture: ComponentFixture<PaymentCreatePageComponent>;
  let component: PaymentCreatePageComponent;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [PaymentCreatePageComponent],
      providers: [
        { provide: MembershipsApiService, useValue: membershipsApi },
        { provide: PaymentsFacade, useValue: facade },
        { provide: IdempotencyKeyService, useValue: keys },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PaymentCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ignora doble submit y conserva la clave al reintentar la misma intención', () => {
    const request: RegisterPaymentRequest = { membershipId: 'membership-1', method: 'CASH', effectiveOn: '2026-07-23' };
    const pending = new Subject<any>();
    facade.registerPayment.mockReturnValueOnce(pending);

    component.save(request);
    component.save(request);
    expect(facade.registerPayment).toHaveBeenCalledOnce();
    expect(keys.generate).toHaveBeenCalledOnce();
    expect(facade.registerPayment).toHaveBeenLastCalledWith(request, 'attempt-key');

    pending.error({ status: 503, code: 'UNAVAILABLE', message: 'internal' });
    facade.registerPayment.mockReturnValueOnce(of({ id: 'payment-1' }));
    component.save(request);

    expect(facade.registerPayment).toHaveBeenCalledTimes(2);
    expect(keys.generate).toHaveBeenCalledOnce();
  });
});
