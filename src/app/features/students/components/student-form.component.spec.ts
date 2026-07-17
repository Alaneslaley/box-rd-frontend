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
  it('acepta un email válido', () => { component.form.controls.email.setValue('alumno@gymbox.mx'); expect(component.form.controls.email.valid).toBe(true); });
});
