import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, of } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { ApiError } from '../../../core/models/api-error.model';
import { AuthApiService, LoginResponse } from '../../../core/auth/auth-api.service';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  template: `
    <main class="auth-page"><section class="auth-card" aria-labelledby="login-title">
      <p class="eyebrow">{{ appName }}</p><h1 id="login-title">Acceso administrativo</h1>
      <p class="muted">Ingresa con tus credenciales autorizadas.</p>
      @if (error()) { <p class="alert alert-error" role="alert">{{ error() }}</p> }
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label for="username">Correo o usuario</label>
        <input id="username" type="text" formControlName="username" autocomplete="username" />
        @if (form.controls.username.touched && form.controls.username.invalid) { <span class="field-error">Ingresa tu correo o usuario.</span> }
        <label for="password">Contraseña</label>
        <input id="password" type="password" formControlName="password" autocomplete="current-password" />
        @if (form.controls.password.touched && form.controls.password.invalid) { <span class="field-error">La contraseña es obligatoria.</span> }
        <button class="btn btn-primary" type="submit" [disabled]="form.invalid || submitting()">{{ submitting() ? 'Ingresando…' : 'Ingresar' }}</button>
      </form>
      <p class="auth-note">El acceso y los permisos definitivos se validan en el servidor.</p>
    </section></main>`,
})
export class LoginPageComponent {
  private readonly api = inject(AuthApiService);
  private readonly session = inject(AuthSessionStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly config = inject(APP_CONFIG);
  readonly appName = this.config.appName;
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = new FormGroup({ username: new FormControl('', { nonNullable: true, validators: [Validators.required] }), password: new FormControl('', { nonNullable: true, validators: [Validators.required] }) });
  readonly redirectUrl = computed(() => this.route.snapshot.queryParamMap.get('redirectUrl') || '/dashboard');

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true); this.error.set(null);
    const request = this.form.getRawValue();
    const response$ = this.config.enableMockAuth ? of(this.mockResponse(request.username)) : this.api.login(request);
    response$.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: (response) => { this.session.loginSuccess({ accessToken: response.accessToken, refreshToken: response.refreshToken ?? null, user: response.user }); void this.router.navigateByUrl(this.redirectUrl()); },
      error: (error: ApiError) => this.error.set(error.message || 'No fue posible iniciar sesión.'),
    });
  }
  private mockResponse(username: string): LoginResponse {
    return { accessToken: 'mock-token-only-for-ui', user: { id: 'mock-user', username, fullName: 'Usuario de prueba', roles: ['ADMIN'], permissions: ['dashboard.read', 'students.read', 'memberships.read', 'payments.read', 'cash.read-current', 'attendance.read', 'reports.admin.read', 'users.read', 'sports.dashboard.read'] } };
  }
}
