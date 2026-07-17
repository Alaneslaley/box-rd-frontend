import { TestBed } from '@angular/core/testing';
import { CashCloseFormComponent } from './cash-close-form.component';
import { CashOpenFormComponent } from './cash-open-form.component';

describe('formularios de caja', () => {
  it('invalida caja inicial negativa', async () => { await TestBed.configureTestingModule({ imports: [CashOpenFormComponent] }).compileComponents(); const component = TestBed.createComponent(CashOpenFormComponent).componentInstance; component.form.controls.initialCash.setValue(-1); expect(component.form.controls.initialCash.invalid).toBe(true); });
  it('invalida efectivo contado negativo', async () => { await TestBed.configureTestingModule({ imports: [CashCloseFormComponent] }).compileComponents(); const component = TestBed.createComponent(CashCloseFormComponent).componentInstance; component.form.controls.countedCash.setValue(-1); expect(component.form.controls.countedCash.invalid).toBe(true); });
  it('invalida moneda que no tenga tres letras ISO', async () => { await TestBed.configureTestingModule({ imports: [CashOpenFormComponent] }).compileComponents(); const component = TestBed.createComponent(CashOpenFormComponent).componentInstance; component.form.controls.currency.setValue('MX'); expect(component.form.controls.currency.invalid).toBe(true); component.form.controls.currency.setValue('MXN'); expect(component.form.controls.currency.valid).toBe(true); });
});
