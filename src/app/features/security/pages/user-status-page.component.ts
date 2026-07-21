import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { SecurityFacade } from '../data-access/security.facade';
import { currentUserNavigationState } from '../data-access/user-route-state';
import { securityErrorMessage } from '../models/security-error-message';
import { userStatusLabel, userStatusTone } from '../models/security-labels';
import { UserSnapshot, UserStatus } from '../models/security.models';

@Component({ selector: 'app-user-status-page', imports: [RouterLink, ReactiveFormsModule, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  @if (loading()) { <app-loading-state message="Cargando usuario desde el listado…" /> }
  @else if (error(); as message) { <app-error-state [message]="message" [traceId]="traceId()"><a class="btn btn-secondary" routerLink="/security/users">Volver al listado</a></app-error-state> }
  @else if (user(); as current) { <app-page-header title="Cambiar estado" [description]="current.firstName + ' ' + current.lastName + ' · ' + current.email" phase="Sprint 7"><a class="btn btn-secondary" [routerLink]="['/security/users', current.id]" [state]="{ user: current }">Cancelar</a></app-page-header>
    @if (saveError(); as message) { <app-error-state title="No fue posible cambiar el estado" [message]="message" [traceId]="traceId()" /> }
    <form class="student-form" [formGroup]="form" (ngSubmit)="save()" novalidate><section class="card form-section"><h2>Estado de cuenta</h2><p>Estado actual: <app-status-badge [label]="statusLabel(current.status)" [tone]="statusTone(current.status)" /></p><div class="form-field"><label for="user-status">Nuevo estado *</label><select id="user-status" formControlName="status"><option value="ACTIVO">Activo</option><option value="INACTIVO">Inactivo</option><option value="BLOQUEADO">Bloqueado</option></select></div>@if (form.controls.status.value !== 'ACTIVO') { <section class="state-card warning-state"><h2>Atención</h2><p>Este cambio puede afectar el acceso a la cuenta.</p></section> }@if (isCurrentUser(current)) { <section class="state-card warning-state"><h2>Cuenta actual</h2><p>Estás modificando tu propia cuenta.</p></section> }</section><div class="form-actions"><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Guardando…' : 'Guardar estado' }}</button></div></form>
  }
` })
export class UserStatusPageComponent implements OnInit {
  private readonly facade = inject(SecurityFacade); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); private readonly session = inject(AuthSessionStore);
  readonly user = signal<UserSnapshot | null>(null); readonly loading = signal(true); readonly error = signal<string | null>(null); readonly saveError = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined); readonly saving = signal(false);
  readonly form = new FormGroup({ status: new FormControl<UserStatus>('ACTIVO', { nonNullable: true, validators: [Validators.required] }) });
  ngOnInit(): void { const id = this.route.snapshot.paramMap.get('id') ?? ''; this.facade.resolveUserFromCurrentPageOrState(id, currentUserNavigationState(this.router)).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (user) => { if (user) { this.user.set(user); this.form.controls.status.setValue(user.status as UserStatus); } else this.error.set('No se pudo cargar el usuario desde la página actual. Vuelve al listado y abre esta acción nuevamente.'); }, error: (error: ApiError) => { this.error.set(securityErrorMessage(error, 'No fue posible cargar el usuario.')); this.traceId.set(error.traceId); } }); }
  save(): void { const current = this.user(); if (!current || this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving.set(true); this.saveError.set(null); this.facade.updateUserStatus(current.id, { status: this.form.controls.status.value }).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => void this.router.navigate(['/security/users'], { state: { successMessage: 'Estado actualizado correctamente.' } }), error: (error: ApiError) => { this.saveError.set(securityErrorMessage(error, 'No fue posible actualizar el estado.')); this.traceId.set(error.traceId); } }); }
  isCurrentUser(user: UserSnapshot): boolean { return this.session.user()?.id === user.id; }
  statusLabel = userStatusLabel; statusTone = userStatusTone;
}
