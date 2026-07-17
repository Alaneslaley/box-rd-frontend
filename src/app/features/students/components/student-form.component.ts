import { Component, effect, input, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { STUDENT_LEVEL_OPTIONS } from '../models/student-labels';
import { StudentLevel, StudentResponse, StudentUpdateRequest } from '../models/student.models';

const PHONE_PATTERN = /^[0-9+()\-\s]{7,25}$/;
const NOT_BLANK_PATTERN = /\S/;

function notFutureDate(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value;
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return value && value > localToday ? { futureDate: true } : null;
}

function optionalGroup(requiredFields: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as Record<string, string>;
    const hasAnyValue = Object.values(value).some((item) => Boolean(item?.trim()));
    return hasAnyValue && requiredFields.some((field) => !value[field]?.trim()) ? { incompleteOptionalGroup: true } : null;
  };
}

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="student-form" [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
      <section class="card form-section"><h2>Datos personales</h2><div class="form-grid">
        <div class="form-field"><label for="firstName">Nombre *</label><input id="firstName" formControlName="firstName" maxlength="100" autocomplete="given-name" />@if (invalid('firstName')) { <span class="field-error">El nombre es obligatorio y admite máximo 100 caracteres.</span> }</div>
        <div class="form-field"><label for="lastName">Apellidos *</label><input id="lastName" formControlName="lastName" maxlength="120" autocomplete="family-name" />@if (invalid('lastName')) { <span class="field-error">Los apellidos son obligatorios y admiten máximo 120 caracteres.</span> }</div>
        <div class="form-field"><label for="birthDate">Fecha de nacimiento *</label><input id="birthDate" type="date" formControlName="birthDate" />@if (invalid('birthDate')) { <span class="field-error">Ingresa una fecha válida que no sea futura.</span> }</div>
        <div class="form-field"><label for="level">Nivel *</label><select id="level" formControlName="level">@for (option of levels; track option.value) { <option [value]="option.value">{{ option.label }}</option> }</select></div>
        <div class="form-field"><label for="email">Correo electrónico</label><input id="email" type="email" formControlName="email" maxlength="254" autocomplete="email" />@if (invalid('email')) { <span class="field-error">Ingresa un correo electrónico válido.</span> }</div>
        <div class="form-field"><label for="phone">Teléfono</label><input id="phone" type="tel" formControlName="phone" maxlength="25" autocomplete="tel" />@if (invalid('phone')) { <span class="field-error">Usa entre 7 y 25 caracteres telefónicos válidos.</span> }</div>
        <div class="form-field form-field-wide"><label for="personalGoal">Objetivo personal</label><textarea id="personalGoal" formControlName="personalGoal" maxlength="300" rows="3"></textarea></div>
      </div></section>

      <section class="card form-section" formGroupName="guardian"><h2>Tutor opcional</h2><p>Si capturas un tutor, nombre, teléfono y relación son obligatorios para completar el DTO.</p><div class="form-grid">
        <div class="form-field"><label for="guardianFirstName">Nombre</label><input id="guardianFirstName" formControlName="firstName" maxlength="100" /></div>
        <div class="form-field"><label for="guardianLastName">Apellidos</label><input id="guardianLastName" formControlName="lastName" maxlength="120" /></div>
        <div class="form-field"><label for="guardianPhone">Teléfono</label><input id="guardianPhone" type="tel" formControlName="phone" maxlength="25" /></div>
        <div class="form-field"><label for="guardianEmail">Correo</label><input id="guardianEmail" type="email" formControlName="email" maxlength="254" /></div>
        <div class="form-field"><label for="guardianRelationship">Relación</label><input id="guardianRelationship" formControlName="relationship" maxlength="60" placeholder="Madre, padre, tutor…" /></div>
      </div>@if (form.controls.guardian.touched && form.controls.guardian.invalid) { <p class="field-error">Completa nombre, teléfono y relación; verifica también correo y teléfono.</p> }</section>

      <section class="card form-section" formGroupName="emergencyContact"><h2>Contacto de emergencia opcional</h2><p>Si capturas un contacto, nombre, teléfono y relación son obligatorios.</p><div class="form-grid">
        <div class="form-field"><label for="emergencyName">Nombre</label><input id="emergencyName" formControlName="name" maxlength="160" /></div>
        <div class="form-field"><label for="emergencyPhone">Teléfono</label><input id="emergencyPhone" type="tel" formControlName="phone" maxlength="25" /></div>
        <div class="form-field"><label for="emergencyRelationship">Relación</label><input id="emergencyRelationship" formControlName="relationship" maxlength="60" /></div>
      </div>@if (form.controls.emergencyContact.touched && form.controls.emergencyContact.invalid) { <p class="field-error">Completa nombre, teléfono y relación con formatos válidos.</p> }</section>

      <div class="form-actions"><button class="btn btn-secondary" type="button" [disabled]="saving()" (click)="cancelled.emit()">Cancelar</button><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Guardando…' : submitLabel() }}</button></div>
    </form>
  `,
})
export class StudentFormComponent {
  readonly student = input<StudentResponse | null>(null);
  readonly saving = input(false);
  readonly submitLabel = input('Guardar alumno');
  readonly submitted = output<StudentUpdateRequest>();
  readonly cancelled = output<void>();
  readonly levels = STUDENT_LEVEL_OPTIONS;

  readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(NOT_BLANK_PATTERN), Validators.maxLength(100)] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(NOT_BLANK_PATTERN), Validators.maxLength(120)] }),
    birthDate: new FormControl('', { nonNullable: true, validators: [Validators.required, notFutureDate] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.pattern(PHONE_PATTERN), Validators.maxLength(25)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email, Validators.maxLength(254)] }),
    personalGoal: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(300)] }),
    level: new FormControl<StudentLevel>('UNASSIGNED', { nonNullable: true, validators: [Validators.required] }),
    guardian: new FormGroup({
      firstName: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }), lastName: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(120)] }),
      phone: new FormControl('', { nonNullable: true, validators: [Validators.pattern(PHONE_PATTERN), Validators.maxLength(25)] }), email: new FormControl('', { nonNullable: true, validators: [Validators.email, Validators.maxLength(254)] }),
      relationship: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(60)] }),
    }, { validators: optionalGroup(['firstName', 'phone', 'relationship']) }),
    emergencyContact: new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(160)] }), phone: new FormControl('', { nonNullable: true, validators: [Validators.pattern(PHONE_PATTERN), Validators.maxLength(25)] }), relationship: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(60)] }),
    }, { validators: optionalGroup(['name', 'phone', 'relationship']) }),
  });

  constructor() {
    effect(() => {
      const student = this.student();
      if (!student) return;
      this.form.reset({ firstName: student.firstName, lastName: student.lastName, birthDate: student.birthDate, phone: student.phone ?? '', email: student.email ?? '', personalGoal: student.personalGoal ?? '', level: student.level,
        guardian: { firstName: student.guardian?.firstName ?? '', lastName: student.guardian?.lastName ?? '', phone: student.guardian?.phone ?? '', email: student.guardian?.email ?? '', relationship: student.guardian?.relationship ?? '' },
        emergencyContact: { name: student.emergencyContact?.name ?? '', phone: student.emergencyContact?.phone ?? '', relationship: student.emergencyContact?.relationship ?? '' } });
    });
  }

  invalid(controlName: 'firstName' | 'lastName' | 'birthDate' | 'phone' | 'email'): boolean { const control = this.form.controls[controlName]; return control.touched && control.invalid; }

  submitForm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const hasGuardian = Object.values(value.guardian).some((item) => Boolean(item.trim()));
    const hasEmergency = Object.values(value.emergencyContact).some((item) => Boolean(item.trim()));
    this.submitted.emit({ firstName: value.firstName.trim(), lastName: value.lastName.trim(), birthDate: value.birthDate, phone: value.phone.trim() || null, email: value.email.trim() || null,
      personalGoal: value.personalGoal.trim() || null, level: value.level,
      guardian: hasGuardian ? { firstName: value.guardian.firstName.trim(), lastName: value.guardian.lastName.trim() || null, phone: value.guardian.phone.trim(), email: value.guardian.email.trim() || null, relationship: value.guardian.relationship.trim() } : null,
      emergencyContact: hasEmergency ? { name: value.emergencyContact.name.trim(), phone: value.emergencyContact.phone.trim(), relationship: value.emergencyContact.relationship.trim() } : null });
  }
}
