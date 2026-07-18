import { TestBed } from '@angular/core/testing';
import { IncomeSummaryComponent } from './income-summary.component';

describe('IncomeSummaryComponent', () => {
  it('muestra totales e ingresos por método', async () => { await TestBed.configureTestingModule({ imports: [IncomeSummaryComponent] }).compileComponents(); const fixture = TestBed.createComponent(IncomeSummaryComponent); fixture.componentRef.setInput('incomeToday', [{ currency: 'MXN', amount: 700 }]); fixture.componentRef.setInput('incomeByMethod', [{ method: 'CASH', currency: 'MXN', payments: 2, amount: 500 }]); fixture.detectChanges(); const text = fixture.nativeElement.textContent; expect(text).toContain('MXN'); expect(text).toContain('Efectivo'); expect(text).toContain('2'); });
  it('muestra estados vacíos parciales', async () => { await TestBed.configureTestingModule({ imports: [IncomeSummaryComponent] }).compileComponents(); const fixture = TestBed.createComponent(IncomeSummaryComponent); fixture.detectChanges(); const text = fixture.nativeElement.textContent; expect(text).toContain('Sin ingresos para mostrar'); expect(text).toContain('Sin desglose por método'); });
});
