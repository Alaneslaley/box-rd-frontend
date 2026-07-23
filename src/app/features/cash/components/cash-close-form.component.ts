import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloseCashRegisterRequest } from '../models/cash-register.models';

const CURRENCY_PATTERN = /^[A-Z]{3}$/;

@Component({ selector: 'app-cash-close-form', imports: [ReactiveFormsModule], template: `
  <form class="student-form" [formGroup]="form" (ngSubmit)="submitForm()" novalidate><section class="card form-section"><h2>Conteo de cierre</h2><p>La diferencia se mostrará cuando se complete el cierre.</p><div class="form-grid">
    <div class="form-field"><label for="counted-cash">Efectivo contado *</label><input id="counted-cash" type="number" min="0" step="0.01" formControlName="countedCash" />@if (invalid('countedCash')) { <span class="field-error">Ingresa un monto igual o mayor que cero.</span> }</div>
    <div class="form-field"><label for="close-currency">Moneda *</label><input id="close-currency" formControlName="currency" minlength="3" maxlength="3" />@if (invalid('currency')) { <span class="field-error">Usa un código ISO de tres letras mayúsculas.</span> }</div>
    <div class="form-field form-field-wide"><label for="close-notes">Notas</label><textarea id="close-notes" formControlName="notes" maxlength="500" rows="4"></textarea>@if (invalid('notes')) { <span class="field-error">Las notas admiten máximo 500 caracteres.</span> }</div>
  </div></section><div class="form-actions"><button class="btn btn-secondary" type="button" [disabled]="saving()" (click)="cancelled.emit()">Cancelar</button><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Cerrando…' : 'Cerrar caja' }}</button></div></form>` })
export class CashCloseFormComponent {
  readonly currency = input('MXN');
  readonly saving = input(false);
  readonly submitted = output<CloseCashRegisterRequest>();
  readonly cancelled = output<void>();
  readonly form = new FormGroup({ countedCash: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }), currency: new FormControl('MXN', { nonNullable: true, validators: [Validators.required, Validators.pattern(CURRENCY_PATTERN)] }), notes: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }) });
  constructor() { effect(() => this.form.controls.currency.setValue(this.currency(), { emitEvent: false })); }
  invalid(name: keyof typeof this.form.controls): boolean { const control = this.form.controls[name]; return control.touched && control.invalid; }
  submitForm(): void { if (this.saving() || this.form.invalid) { this.form.markAllAsTouched(); return; } const value = this.form.getRawValue(); this.submitted.emit({ countedCash: value.countedCash as number, currency: value.currency.toUpperCase(), notes: value.notes.trim() || null }); }
}
