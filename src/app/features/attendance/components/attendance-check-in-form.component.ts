import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentSummaryResponse } from '../../students/models/student.models';

@Component({
  selector: 'app-attendance-check-in-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="card attendance-checkin-form" [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
      <div class="form-field">
        <label for="checkin-student">Alumno</label>
        <select id="checkin-student" formControlName="studentId" [attr.aria-describedby]="form.controls.studentId.invalid && form.controls.studentId.touched ? 'student-required' : null">
          <option value="">Selecciona un alumno</option>
          @if (preselectedStudentId() && !containsStudent(preselectedStudentId())) { <option [value]="preselectedStudentId()">Alumno seleccionado · {{ preselectedStudentId() }}</option> }
          @for (student of students(); track student.id) { <option [value]="student.id">{{ student.fullName }} · {{ student.phone || 'Sin teléfono' }}</option> }
        </select>
        @if (form.controls.studentId.invalid && form.controls.studentId.touched) { <small class="field-error" id="student-required">Selecciona un alumno.</small> }
      </div>
      <p class="field-help">La disponibilidad y el registro se confirmarán al guardar.</p>
      <div class="form-actions"><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Registrando…' : 'Registrar check-in' }}</button></div>
    </form>
  `,
})
export class AttendanceCheckInFormComponent {
  readonly students = input<StudentSummaryResponse[]>([]);
  readonly preselectedStudentId = input<string | null>(null);
  readonly saving = input(false);
  readonly checkIn = output<string>();
  readonly form = new FormGroup({ studentId: new FormControl('', { nonNullable: true, validators: [Validators.required] }) });

  constructor() {
    effect(() => { const studentId = this.preselectedStudentId(); if (studentId && !this.form.dirty) this.form.controls.studentId.setValue(studentId); });
  }

  submitForm(): void {
    if (this.saving() || this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.checkIn.emit(this.form.controls.studentId.value);
  }

  containsStudent(studentId: string | null): boolean { return !!studentId && this.students().some((student) => student.id === studentId); }
}
