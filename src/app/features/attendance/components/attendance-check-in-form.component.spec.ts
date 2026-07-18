import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendanceCheckInFormComponent } from './attendance-check-in-form.component';

describe('AttendanceCheckInFormComponent', () => {
  let fixture: ComponentFixture<AttendanceCheckInFormComponent>; let component: AttendanceCheckInFormComponent;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [AttendanceCheckInFormComponent] }).compileComponents(); fixture = TestBed.createComponent(AttendanceCheckInFormComponent); component = fixture.componentInstance; fixture.detectChanges(); });
  it('invalida studentId vacío', () => { component.submitForm(); expect(component.form.invalid).toBe(true); expect(component.form.controls.studentId.touched).toBe(true); });
  it('deshabilita el botón durante el envío', () => { fixture.componentRef.setInput('saving', true); fixture.detectChanges(); expect((fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(true); });
  it('emite el alumno seleccionado', () => { const emitted = vi.fn(); component.checkIn.subscribe(emitted); component.form.controls.studentId.setValue('student-id'); component.submitForm(); expect(emitted).toHaveBeenCalledWith('student-id'); });
});
