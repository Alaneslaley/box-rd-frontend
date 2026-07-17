import { Component, effect, output, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpenCashRegisterRequest } from '../models/cash-register.models';

const CURRENCY_PATTERN = /^[A-Z]{3}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Component({ selector: 'app-cash-open-form', imports: [ReactiveFormsModule], template: `
  <form class="student-form" [formGroup]="form" (ngSubmit)="submitForm()" novalidate><section class="card form-section"><h2>Apertura de caja</h2><p>La sucursal se toma de la sesión cuando está disponible.</p><div class="form-grid">
    <div class="form-field form-field-wide"><label for="cash-branch">Sucursal (UUID opcional)</label><input id="cash-branch" formControlName="branchId" [readOnly]="initialBranchId() !== ''" placeholder="Se usará la sucursal de la sesión" />@if (invalid('branchId')) { <span class="field-error">Ingresa un UUID de sucursal válido.</span> }</div>
    <div class="form-field"><label for="initial-cash">Caja inicial *</label><input id="initial-cash" type="number" min="0" step="0.01" formControlName="initialCash" />@if (invalid('initialCash')) { <span class="field-error">Ingresa un monto igual o mayor que cero.</span> }</div>
    <div class="form-field"><label for="open-currency">Moneda *</label><input id="open-currency" formControlName="currency" minlength="3" maxlength="3" placeholder="MXN" />@if (invalid('currency')) { <span class="field-error">Usa un código ISO de tres letras mayúsculas.</span> }</div>
  </div></section><div class="form-actions"><button class="btn btn-secondary" type="button" [disabled]="saving()" (click)="cancelled.emit()">Cancelar</button><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Abriendo…' : 'Abrir caja' }}</button></div></form>` })
export class CashOpenFormComponent {
  readonly initialBranchId = input('');
  readonly saving = input(false);
  readonly submitted = output<OpenCashRegisterRequest>();
  readonly cancelled = output<void>();
  readonly form = new FormGroup({ branchId: new FormControl('', { nonNullable: true, validators: [Validators.pattern(UUID_PATTERN)] }), initialCash: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }), currency: new FormControl('MXN', { nonNullable: true, validators: [Validators.required, Validators.pattern(CURRENCY_PATTERN)] }) });
  constructor() { effect(() => this.form.controls.branchId.setValue(this.initialBranchId(), { emitEvent: false })); }
  invalid(name: keyof typeof this.form.controls): boolean { const control = this.form.controls[name]; return control.touched && control.invalid; }
  submitForm(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } const value = this.form.getRawValue(); const branchId = value.branchId.trim(); this.submitted.emit({ ...(branchId ? { branchId } : {}), initialCash: value.initialCash as number, currency: value.currency.toUpperCase() }); }
}
