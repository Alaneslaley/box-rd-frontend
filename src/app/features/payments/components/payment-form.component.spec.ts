import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentFormComponent } from './payment-form.component';

describe('PaymentFormComponent', () => {
  let fixture: ComponentFixture<PaymentFormComponent>;
  let component: PaymentFormComponent;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [PaymentFormComponent] }).compileComponents(); fixture = TestBed.createComponent(PaymentFormComponent); component = fixture.componentInstance; fixture.detectChanges(); });
  it('invalida membershipId vacío', () => { component.form.patchValue({ membershipId: '', method: 'CASH', effectiveOn: '2026-07-17' }); expect(component.form.controls.membershipId.invalid).toBe(true); });
  it('invalida method vacío', () => { component.form.patchValue({ membershipId: 'membership-id', method: '', effectiveOn: '2026-07-17' }); expect(component.form.controls.method.invalid).toBe(true); });
  it('invalida effectiveOn vacío', () => { component.form.patchValue({ membershipId: 'membership-id', method: 'TRANSFER', effectiveOn: '' }); expect(component.form.controls.effectiveOn.invalid).toBe(true); });
});
