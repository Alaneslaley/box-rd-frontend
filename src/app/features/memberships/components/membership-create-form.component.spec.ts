import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembershipCreateFormComponent } from './membership-create-form.component';

describe('MembershipCreateFormComponent', () => {
  let fixture: ComponentFixture<MembershipCreateFormComponent>;
  let component: MembershipCreateFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MembershipCreateFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(MembershipCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('requiere alumno', () => { component.form.patchValue({ studentId: '', planId: 'plan', startDate: '2026-07-17' }); expect(component.form.controls.studentId.invalid).toBe(true); });
  it('requiere plan', () => { component.form.patchValue({ studentId: 'student', planId: '', startDate: '2026-07-17' }); expect(component.form.controls.planId.invalid).toBe(true); });
  it('requiere fecha LocalDate', () => { component.form.patchValue({ studentId: 'student', planId: 'plan', startDate: '17/07/2026' }); expect(component.form.controls.startDate.invalid).toBe(true); component.form.controls.startDate.setValue('2026-07-17'); expect(component.form.valid).toBe(true); });
});
