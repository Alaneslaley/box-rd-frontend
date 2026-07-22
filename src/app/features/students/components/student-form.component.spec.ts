import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentFormComponent } from './student-form.component';

describe('StudentFormComponent', () => {
  let fixture: ComponentFixture<StudentFormComponent>;
  let component: StudentFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StudentFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    component.form.controls.lastName.setValue('Pérez');
    component.form.controls.birthDate.setValue('2000-01-01');
    fixture.detectChanges();
  });

  it('invalida un nombre vacío', () => { component.form.controls.firstName.setValue(''); expect(component.form.controls.firstName.invalid).toBe(true); });
  it('invalida una fecha de nacimiento futura', () => { component.form.controls.birthDate.setValue('2999-01-01'); expect(component.form.controls.birthDate.hasError('futureDate')).toBe(true); });
  it('requiere teléfono celular', () => { component.form.controls.phone.setValue(''); expect(component.form.controls.phone.hasError('required')).toBe(true); });
  it('invalida teléfono de más de 25 caracteres', () => { component.form.controls.phone.setValue('1'.repeat(26)); expect(component.form.controls.phone.hasError('maxlength')).toBe(true); });
  it('emite teléfono y no correo del alumno', () => {
    const emitted = vi.fn(); component.submitted.subscribe(emitted);
    component.form.patchValue({ firstName: 'Ana', phone: '5551234567' }); component.submitForm();
    expect(emitted).toHaveBeenCalledWith(expect.objectContaining({ phone: '5551234567' }));
    expect(emitted.mock.calls[0][0]).not.toHaveProperty('email');
  });
  it('conserva el correo opcional del tutor', () => { component.form.controls.guardian.controls.email.setValue('tutor@gymbox.mx'); expect(component.form.controls.guardian.controls.email.valid).toBe(true); });
});
