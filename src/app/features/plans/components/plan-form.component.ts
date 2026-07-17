import { Component, effect, input, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PLAN_TYPE_OPTIONS } from '../models/plan-labels';
import { CreatePlanRequest, PlanSnapshot, PlanStatus, PlanType, UpdatePlanRequest } from '../models/plan.models';

const NOT_BLANK_PATTERN = /\S/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

function optionalPositiveInteger(control: AbstractControl<number | null>): ValidationErrors | null {
  const value = control.value;
  return value === null || (Number.isInteger(value) && value >= 1) ? null : { positiveInteger: true };
}

@Component({
  selector: 'app-plan-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="student-form" [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
      <section class="card form-section"><h2>Datos del plan</h2><p>La vigencia y aplicación final son determinadas por el backend.</p><div class="form-grid">
        <div class="form-field"><label for="plan-name">Nombre *</label><input id="plan-name" formControlName="name" maxlength="120" />@if (invalid('name')) { <span class="field-error">El nombre es obligatorio y admite máximo 120 caracteres.</span> }</div>
        <div class="form-field"><label for="plan-type">Tipo *</label><select id="plan-type" formControlName="type">@for (option of types; track option.value) { <option [value]="option.value">{{ option.label }}</option> }</select>@if (mode() === 'edit') { <small class="field-help">El contrato de edición no permite cambiar el tipo.</small> }</div>
        <div class="form-field form-field-wide"><label for="plan-description">Descripción</label><textarea id="plan-description" formControlName="description" maxlength="300" rows="3"></textarea>@if (invalid('description')) { <span class="field-error">La descripción admite máximo 300 caracteres.</span> }</div>
        <div class="form-field"><label for="plan-price">Precio *</label><input id="plan-price" type="number" min="0" step="0.01" formControlName="price" />@if (invalid('price')) { <span class="field-error">Ingresa un precio igual o mayor que cero.</span> }</div>
        <div class="form-field"><label for="plan-currency">Moneda *</label><input id="plan-currency" formControlName="currency" minlength="3" maxlength="3" autocapitalize="characters" placeholder="MXN" />@if (invalid('currency')) { <span class="field-error">Usa un código de tres letras mayúsculas, por ejemplo MXN.</span> }</div>
        <div class="form-field"><label for="plan-validity">Días de vigencia</label><input id="plan-validity" type="number" min="1" step="1" formControlName="validityDays" />@if (invalid('validityDays')) { <span class="field-error">Si se captura, debe ser un entero mayor que cero.</span> }</div>
        <div class="form-field"><label for="plan-classes">Clases incluidas</label><input id="plan-classes" type="number" min="1" step="1" formControlName="includedClasses" />@if (invalid('includedClasses')) { <span class="field-error">Si se captura, debe ser un entero mayor que cero.</span> }</div>
        @if (mode() === 'edit') { <div class="form-field"><label for="plan-status">Estado *</label><select id="plan-status" formControlName="status"><option value="ACTIVO">Activo</option><option value="INACTIVO">Inactivo</option></select></div> }
      </div></section>
      <div class="form-actions"><button class="btn btn-secondary" type="button" [disabled]="saving()" (click)="cancelled.emit()">Cancelar</button><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Guardando…' : submitLabel() }}</button></div>
    </form>
  `,
})
export class PlanFormComponent {
  readonly mode = input<'create' | 'edit'>('create');
  readonly plan = input<PlanSnapshot | null>(null);
  readonly saving = input(false);
  readonly submitLabel = input('Guardar plan');
  readonly createSubmitted = output<CreatePlanRequest>();
  readonly updateSubmitted = output<UpdatePlanRequest>();
  readonly cancelled = output<void>();
  readonly types = PLAN_TYPE_OPTIONS;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(NOT_BLANK_PATTERN), Validators.maxLength(120)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(300)] }),
    type: new FormControl<PlanType>('MONTHLY', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    currency: new FormControl('MXN', { nonNullable: true, validators: [Validators.required, Validators.pattern(CURRENCY_PATTERN)] }),
    validityDays: new FormControl<number | null>(null, { validators: [optionalPositiveInteger] }),
    includedClasses: new FormControl<number | null>(null, { validators: [optionalPositiveInteger] }),
    status: new FormControl<PlanStatus>('ACTIVO', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    effect(() => {
      const editMode = this.mode() === 'edit';
      if (editMode) this.form.controls.type.disable({ emitEvent: false }); else this.form.controls.type.enable({ emitEvent: false });
      const plan = this.plan();
      if (!plan) return;
      this.form.reset({ name: plan.name, description: plan.description ?? '', type: plan.type, price: plan.price, currency: plan.currency, validityDays: plan.validityDays, includedClasses: plan.includedClasses, status: plan.status });
    });
  }

  invalid(name: keyof typeof this.form.controls): boolean { const control = this.form.controls[name]; return control.touched && control.invalid; }

  submitForm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const common = { name: value.name.trim(), description: value.description.trim() || null, price: value.price as number, currency: value.currency.trim().toUpperCase(), validityDays: value.validityDays, includedClasses: value.includedClasses };
    if (this.mode() === 'edit') this.updateSubmitted.emit({ ...common, status: value.status });
    else this.createSubmitted.emit({ ...common, type: value.type });
  }
}
