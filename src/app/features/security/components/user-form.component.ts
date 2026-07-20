import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserRequest, RoleSnapshot } from '../models/security.models';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NOT_BLANK_PATTERN = /\S/;

@Component({ selector: 'app-user-form', imports: [ReactiveFormsModule], template: `
  <form class="student-form user-form" [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
    <section class="card form-section"><h2>Datos del usuario</h2><p>La contraseña temporal se usa únicamente para crear la cuenta.</p><div class="form-grid">
      <div class="form-field form-field-wide"><label for="user-branch">Sucursal asignada *</label><input id="user-branch" formControlName="branchId" maxlength="36" placeholder="Identificador de la sucursal" />@if (invalid('branchId')) { <span class="field-error">Ingresa un identificador de sucursal válido.</span> }<small class="field-help">Selecciona la sucursal correspondiente al crear la cuenta.</small></div>
      <div class="form-field"><label for="user-first-name">Nombre *</label><input id="user-first-name" formControlName="firstName" maxlength="100" />@if (invalid('firstName')) { <span class="field-error">El nombre es obligatorio y admite máximo 100 caracteres.</span> }</div>
      <div class="form-field"><label for="user-last-name">Apellidos *</label><input id="user-last-name" formControlName="lastName" maxlength="120" />@if (invalid('lastName')) { <span class="field-error">Los apellidos son obligatorios y admiten máximo 120 caracteres.</span> }</div>
      <div class="form-field"><label for="user-email">Correo *</label><input id="user-email" type="email" formControlName="email" maxlength="254" autocomplete="email" />@if (invalid('email')) { <span class="field-error">Captura un correo válido de máximo 254 caracteres.</span> }</div>
      <div class="form-field"><label for="user-phone">Teléfono</label><input id="user-phone" formControlName="phone" maxlength="25" autocomplete="tel" />@if (invalid('phone')) { <span class="field-error">El teléfono admite máximo 25 caracteres.</span> }</div>
      <div class="form-field form-field-wide"><label for="user-password">Contraseña temporal *</label><input id="user-password" type="password" formControlName="password" minlength="12" maxlength="128" autocomplete="new-password" />@if (invalid('password')) { <span class="field-error">La contraseña debe tener entre 12 y 128 caracteres.</span> }</div>
    </div></section>
    <section class="card form-section"><h2>Roles *</h2><p>Selecciona los roles necesarios para esta cuenta.</p>
      @if (!roles().length) { <p class="muted">No hay roles disponibles para seleccionar.</p> }
      @else { <div class="role-option-grid">@for (role of roles(); track role.id) { <label class="role-option"><input type="checkbox" [checked]="form.controls.roles.value.includes(role.code)" (change)="toggleRole(role.code, $any($event.target).checked)" /><span><strong>{{ role.name || role.code }}</strong><small>{{ role.code }} · {{ role.description || 'Sin descripción' }}</small></span></label> }</div> }
      @if (invalid('roles')) { <span class="field-error">Selecciona al menos un rol.</span> }
    </section>
    <div class="form-actions"><button class="btn btn-secondary" type="button" [disabled]="saving()" (click)="cancelled.emit()">Cancelar</button><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Creando…' : 'Crear usuario' }}</button></div>
  </form>
` })
export class UserFormComponent {
  readonly roles = input<RoleSnapshot[]>([]);
  readonly initialBranchId = input<string | null>(null);
  readonly saving = input(false);
  readonly submitted = output<CreateUserRequest>();
  readonly cancelled = output<void>();
  readonly form = new FormGroup({
    branchId: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(UUID_PATTERN)] }),
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(NOT_BLANK_PATTERN), Validators.maxLength(100)] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(NOT_BLANK_PATTERN), Validators.maxLength(120)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(254)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(25)] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(12), Validators.maxLength(128)] }),
    roles: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
  });

  constructor() { effect(() => { const branchId = this.initialBranchId(); if (branchId && !this.form.controls.branchId.dirty) this.form.controls.branchId.setValue(branchId, { emitEvent: false }); }); }
  invalid(name: keyof typeof this.form.controls): boolean { const control = this.form.controls[name]; return control.touched && control.invalid; }
  toggleRole(code: string, checked: boolean): void { const selected = this.form.controls.roles.value; this.form.controls.roles.setValue(checked ? [...new Set([...selected, code])] : selected.filter((role) => role !== code)); this.form.controls.roles.markAsTouched(); }
  submitForm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const request: CreateUserRequest = { branchId: value.branchId.trim(), firstName: value.firstName.trim(), lastName: value.lastName.trim(), email: value.email.trim(), ...(value.phone.trim() ? { phone: value.phone.trim() } : {}), password: value.password, roles: value.roles };
    this.submitted.emit(request);
    this.form.controls.password.reset('');
  }
}
