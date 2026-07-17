import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentSummaryResponse } from '../../students/models/student.models';
import { PlanSnapshot } from '../../plans/models/plan.models';
import { CreateMembershipRequest } from '../models/membership.models';

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

@Component({
  selector: 'app-membership-create-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="student-form" [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
      <section class="card form-section"><h2>Asignación de membresía</h2><p>El backend determinará la fecha final, el estado y las clases disponibles.</p><div class="form-grid">
        <div class="form-field"><label for="membership-student">Alumno *</label><select id="membership-student" formControlName="studentId"><option value="">Selecciona un alumno</option>@for (student of students(); track student.id) { <option [value]="student.id">{{ student.fullName }}</option> }</select>@if (invalid('studentId')) { <span class="field-error">Selecciona un alumno.</span> }</div>
        <div class="form-field"><label for="membership-plan">Plan activo *</label><select id="membership-plan" formControlName="planId"><option value="">Selecciona un plan</option>@for (plan of plans(); track plan.id) { <option [value]="plan.id">{{ plan.name }}</option> }</select>@if (invalid('planId')) { <span class="field-error">Selecciona un plan.</span> }</div>
        <div class="form-field"><label for="membership-start-date">Fecha de inicio *</label><input id="membership-start-date" type="date" formControlName="startDate" />@if (invalid('startDate')) { <span class="field-error">Ingresa una fecha en formato válido.</span> }</div>
      </div></section>
      <div class="form-actions"><button class="btn btn-secondary" type="button" [disabled]="saving()" (click)="cancelled.emit()">Cancelar</button><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Creando…' : 'Crear membresía' }}</button></div>
    </form>
  `,
})
export class MembershipCreateFormComponent {
  readonly students = input<readonly StudentSummaryResponse[]>([]);
  readonly plans = input<readonly PlanSnapshot[]>([]);
  readonly initialStudentId = input('');
  readonly saving = input(false);
  readonly submitted = output<CreateMembershipRequest>();
  readonly cancelled = output<void>();

  readonly form = new FormGroup({
    studentId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    planId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startDate: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(LOCAL_DATE_PATTERN)] }),
  });

  constructor() { effect(() => { const studentId = this.initialStudentId(); if (studentId) this.form.controls.studentId.setValue(studentId, { emitEvent: false }); }); }
  invalid(name: keyof typeof this.form.controls): boolean { const control = this.form.controls[name]; return control.touched && control.invalid; }
  submitForm(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.submitted.emit(this.form.getRawValue()); }
}
