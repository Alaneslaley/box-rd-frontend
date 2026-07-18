import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  it('muestra título y valor', async () => { await TestBed.configureTestingModule({ imports: [KpiCardComponent], providers: [provideRouter([])] }).compileComponents(); const fixture = TestBed.createComponent(KpiCardComponent); fixture.componentRef.setInput('title', 'Alumnos activos'); fixture.componentRef.setInput('value', 18); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('Alumnos activos'); expect(fixture.nativeElement.textContent).toContain('18'); });
  it('aplica el tono y conserva una etiqueta accesible', async () => { await TestBed.configureTestingModule({ imports: [KpiCardComponent], providers: [provideRouter([])] }).compileComponents(); const fixture = TestBed.createComponent(KpiCardComponent); fixture.componentRef.setInput('title', 'Membresías vencidas'); fixture.componentRef.setInput('value', 3); fixture.componentRef.setInput('tone', 'warning'); fixture.detectChanges(); const card = fixture.nativeElement.querySelector('.kpi-card') as HTMLElement; expect(card.classList.contains('kpi-tone-warning')).toBe(true); expect(card.getAttribute('aria-label')).toBe('Membresías vencidas: 3'); });
});
