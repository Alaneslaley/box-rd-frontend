import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembershipSnapshot } from '../../memberships/models/membership.models';
import { PAYMENT_METHOD_OPTIONS } from '../models/payment-labels';
import { PaymentMethod, RegisterPaymentRequest } from '../models/payment.models';

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

@Component({
  selector: 'app-payment-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="student-form" [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
      <section class="card form-section"><h2>Datos del pago</h2><p>Confirma la membresía, el método y la fecha del pago.</p><div class="form-grid">
        <div class="form-field form-field-wide"><label for="payment-membership">Membresía *</label><select id="payment-membership" formControlName="membershipId"><option value="">Selecciona una membresía</option>@if (showExternalMembership()) { <option [value]="initialMembershipId()">Membresía seleccionada</option> }@for (membership of memberships(); track membership.id) { <option [value]="membership.id">{{ membership.planName }} · Membresía {{ membership.status }}</option> }</select>@if (invalid('membershipId')) { <span class="field-error">Selecciona una membresía.</span> }</div>
        <div class="form-field"><label for="payment-method">Método *</label><select id="payment-method" formControlName="method"><option value="">Selecciona un método</option>@for (option of methods; track option.value) { <option [value]="option.value">{{ option.label }}</option> }</select>@if (invalid('method')) { <span class="field-error">Selecciona un método de pago.</span> }</div>
        <div class="form-field"><label for="payment-effective-on">Fecha efectiva *</label><input id="payment-effective-on" type="date" formControlName="effectiveOn" />@if (invalid('effectiveOn')) { <span class="field-error">Ingresa una fecha con formato válido.</span> }</div>
      </div></section>
      <div class="form-actions"><button class="btn btn-secondary" type="button" [disabled]="saving()" (click)="cancelled.emit()">Cancelar</button><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Registrando…' : 'Registrar pago' }}</button></div>
    </form>
  `,
})
export class PaymentFormComponent {
  readonly memberships = input<readonly MembershipSnapshot[]>([]);
  readonly initialMembershipId = input('');
  readonly saving = input(false);
  readonly submitted = output<RegisterPaymentRequest>();
  readonly cancelled = output<void>();
  readonly methods = PAYMENT_METHOD_OPTIONS;

  readonly form = new FormGroup({
    membershipId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    method: new FormControl<PaymentMethod | ''>('', { nonNullable: true, validators: [Validators.required] }),
    effectiveOn: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(LOCAL_DATE_PATTERN)] }),
  });

  constructor() { effect(() => { const id = this.initialMembershipId(); if (id) this.form.controls.membershipId.setValue(id, { emitEvent: false }); }); }
  invalid(name: keyof typeof this.form.controls): boolean { const control = this.form.controls[name]; return control.touched && control.invalid; }
  showExternalMembership(): boolean { const id = this.initialMembershipId(); return Boolean(id) && !this.memberships().some((membership) => membership.id === id); }
  submitForm(): void { if (this.saving() || this.form.invalid) { this.form.markAllAsTouched(); return; } const value = this.form.getRawValue(); this.submitted.emit({ membershipId: value.membershipId, method: value.method as PaymentMethod, effectiveOn: value.effectiveOn }); }
}
