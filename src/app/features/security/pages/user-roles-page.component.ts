import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { SecurityFacade } from '../data-access/security.facade';
import { currentUserNavigationState } from '../data-access/user-route-state';
import { securityErrorMessage } from '../models/security-error-message';
import { UserSnapshot } from '../models/security.models';

@Component({ selector: 'app-user-roles-page', imports: [RouterLink, ReactiveFormsModule, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent], template: `
  @if (loadingUser() || facade.rolesLoading()) { <app-loading-state message="Cargando usuario y roles…" /> }
  @else if (loadError(); as message) { <app-error-state [message]="message" [traceId]="traceId()"><a class="btn btn-secondary" routerLink="/security/users">Volver al listado</a></app-error-state> }
  @else if (facade.rolesError(); as error) { <app-error-state title="No fue posible cargar roles" [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadRoles()">Reintentar</button></app-error-state> }
  @else if (user(); as current) { <app-page-header title="Asignar roles" [description]="current.firstName + ' ' + current.lastName + ' · ' + current.email" phase="Sprint 7"><a class="btn btn-secondary" [routerLink]="['/security/users', current.id]" [state]="{ user: current }">Cancelar</a></app-page-header>
    @if (saveError(); as message) { <app-error-state title="No fue posible actualizar roles" [message]="message" [traceId]="traceId()" /> }
    <form class="student-form" [formGroup]="form" (ngSubmit)="save()" novalidate><section class="card form-section"><h2>Roles disponibles</h2><p>La autorización efectiva se calcula en backend a partir de los roles asignados.</p><div class="role-option-grid">@for (role of facade.roles(); track role.id) { <label class="role-option"><input type="checkbox" [checked]="form.controls.roles.value.includes(role.code)" (change)="toggleRole(role.code, $any($event.target).checked)" /><span><strong>{{ role.name || role.code }}</strong><small>{{ role.code }} · {{ role.description || 'Sin descripción' }}</small></span></label> }</div>@if (form.controls.roles.touched && form.controls.roles.invalid) { <span class="field-error">Selecciona al menos un rol.</span> }</section><div class="form-actions"><button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Guardando…' : 'Guardar roles' }}</button></div></form>
  }
` })
export class UserRolesPageComponent implements OnInit {
  readonly facade = inject(SecurityFacade); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router);
  readonly user = signal<UserSnapshot | null>(null); readonly loadingUser = signal(true); readonly loadError = signal<string | null>(null); readonly saveError = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined); readonly saving = signal(false);
  readonly form = new FormGroup({ roles: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }) });
  ngOnInit(): void { const id = this.route.snapshot.paramMap.get('id') ?? ''; this.facade.loadRoles(); this.facade.resolveUserFromCurrentPageOrState(id, currentUserNavigationState(this.router)).pipe(finalize(() => this.loadingUser.set(false))).subscribe({ next: (user) => { if (user) { this.user.set(user); this.form.controls.roles.setValue(user.roles); } else this.loadError.set('No se pudo cargar el usuario desde la página actual. Vuelve al listado y abre esta acción nuevamente.'); }, error: (error: ApiError) => { this.loadError.set(securityErrorMessage(error, 'No fue posible cargar el usuario.')); this.traceId.set(error.traceId); } }); }
  toggleRole(code: string, checked: boolean): void { const selected = this.form.controls.roles.value; this.form.controls.roles.setValue(checked ? [...new Set([...selected, code])] : selected.filter((role) => role !== code)); this.form.controls.roles.markAsTouched(); }
  save(): void { const current = this.user(); if (!current || this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving.set(true); this.saveError.set(null); this.facade.updateUserRoles(current.id, { roles: this.form.controls.roles.value }).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => void this.router.navigate(['/security/users'], { state: { successMessage: 'Roles actualizados correctamente.' } }), error: (error: ApiError) => { this.saveError.set(securityErrorMessage(error, 'No fue posible actualizar los roles.')); this.traceId.set(error.traceId); } }); }
  errorMessage(error: ApiError): string { return securityErrorMessage(error, 'No fue posible cargar los roles.'); }
}
