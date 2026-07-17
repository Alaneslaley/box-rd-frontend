import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [StatusBadgeComponent] }).compileComponents(); fixture = TestBed.createComponent(StatusBadgeComponent); fixture.componentRef.setInput('label', 'Activo'); fixture.componentRef.setInput('tone', 'success'); fixture.detectChanges(); });
  it('muestra texto y tono de estado', () => { const badge = fixture.nativeElement.querySelector('.status-badge') as HTMLElement; expect(badge.textContent).toContain('Activo'); expect(badge.classList).toContain('tone-success'); });
});
