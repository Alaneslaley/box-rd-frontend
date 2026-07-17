import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanFormComponent } from './plan-form.component';

describe('PlanFormComponent', () => {
  let fixture: ComponentFixture<PlanFormComponent>;
  let component: PlanFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PlanFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(PlanFormComponent);
    component = fixture.componentInstance;
    component.form.patchValue({ name: 'Plan mensual', price: 900, currency: 'MXN' });
    fixture.detectChanges();
  });

  it('requiere nombre', () => { component.form.controls.name.setValue(''); expect(component.form.controls.name.invalid).toBe(true); });
  it('rechaza precio negativo', () => { component.form.controls.price.setValue(-1); expect(component.form.controls.price.invalid).toBe(true); });
  it('requiere código de moneda de tres mayúsculas', () => { component.form.controls.currency.setValue('mxn'); expect(component.form.controls.currency.invalid).toBe(true); component.form.controls.currency.setValue('MXN'); expect(component.form.controls.currency.valid).toBe(true); });
  it('no incluye type en UpdatePlanRequest', () => {
    fixture.componentRef.setInput('mode', 'edit');
    fixture.componentRef.setInput('plan', { id: '1', branchId: 'b', name: 'Plan', description: null, type: 'MONTHLY', price: 900, currency: 'MXN', validityDays: 30, includedClasses: null, status: 'ACTIVO' });
    fixture.detectChanges();
    let emitted: unknown;
    component.updateSubmitted.subscribe((value) => emitted = value);
    component.submitForm();
    expect(emitted).toBeDefined();
    expect(emitted).not.toHaveProperty('type');
  });
});
