import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { AuthFacade } from '../../../core/auth/auth.facade';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { safeReturnUrl } from '../../../core/auth/safe-return-url';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  template: `
    <main class="auth-page"><section class="auth-card" aria-labelledby="login-title">
      <p class="eyebrow">{{ appName }}</p><h1 id="login-title">Acceso administrativo</h1>
      <p class="muted">Ingresa con tus credenciales autorizadas.</p>
      @if (error()) { <p class="alert alert-error" role="alert">{{ error() }}</p> }
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label for="email">Correo electrónico</label>
        <input id="email" type="email" formControlName="email" autocomplete="email" />
        @if (form.controls.email.touched && form.controls.email.invalid) { <span class="field-error">Ingresa un correo electrónico válido.</span> }
        <label for="password">Contraseña</label>
        <input id="password" type="password" formControlName="password" autocomplete="current-password" />
        @if (form.controls.password.touched && form.controls.password.invalid) { <span class="field-error">La contraseña es obligatoria.</span> }
        <button class="btn btn-primary" type="submit" [disabled]="form.invalid || submitting()">{{ submitting() ? 'Ingresando…' : 'Ingresar' }}</button>
      </form>
      <p class="auth-note">El acceso y los permisos definitivos se validan en el servidor.</p>
    </section></main>`,
})
export class LoginPageComponent {
  private readonly auth = inject(AuthFacade);
  private readonly config = inject(APP_CONFIG);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly appName = this.config.appName;
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = new FormGroup({ email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }), password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }) });
  readonly returnUrl = computed(() => safeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl')));

  submit(): void {
    if (this.submitting() || this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true); this.error.set(null);
    const request = this.form.getRawValue();
    this.auth.login(request).pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => void this.router.navigateByUrl(this.returnUrl()),
      error: (error: ApiError) => this.error.set(this.loginMessage(error)),
    });
  }
  private loginMessage(error: ApiError): string {
    if (error.status === 401) return 'Usuario o contraseña incorrectos.';
    if (error.status === 403) return 'Tu usuario no tiene permisos para acceder.';
    if (error.status === 0) return 'No se pudo conectar con el servidor.';
    return 'No fue posible iniciar sesión. Intenta nuevamente.';
  }
}
