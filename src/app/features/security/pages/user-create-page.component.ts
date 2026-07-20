import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { UserFormComponent } from '../components/user-form.component';
import { SecurityFacade } from '../data-access/security.facade';
import { securityErrorMessage } from '../models/security-error-message';
import { CreateUserRequest } from '../models/security.models';

@Component({ selector: 'app-user-create-page', imports: [PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, UserFormComponent], template: `
  <app-page-header title="Nuevo usuario" description="Crea una cuenta y asigna uno o más roles." />
  @if (facade.rolesLoading()) { <app-loading-state message="Cargando roles disponibles…" /> }
  @else if (facade.rolesError(); as error) { <app-error-state title="No fue posible cargar roles" [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadRoles()">Reintentar</button></app-error-state> }
  @else if (!facade.roles().length) { <app-empty-state title="No hay roles disponibles" description="No es posible crear un usuario sin roles disponibles." /> }
  @else { @if (saveError(); as error) { <app-error-state title="No fue posible crear el usuario" [message]="errorMessage(error)" [traceId]="error.traceId" /> }<app-user-form [roles]="facade.roles()" [initialBranchId]="branchId" [saving]="saving()" (submitted)="save($event)" (cancelled)="cancel()" /> }
` })
export class UserCreatePageComponent implements OnInit {
  readonly facade = inject(SecurityFacade); private readonly session = inject(AuthSessionStore); private readonly router = inject(Router);
  readonly branchId = this.session.user()?.branchId ?? null; readonly saving = signal(false); readonly saveError = signal<ApiError | null>(null);
  ngOnInit(): void { this.facade.loadRoles(); }
  save(request: CreateUserRequest): void { this.saving.set(true); this.saveError.set(null); this.facade.createUser(request).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => void this.router.navigate(['/security/users'], { state: { successMessage: 'Usuario creado correctamente.' } }), error: (error: ApiError) => this.saveError.set(error) }); }
  cancel(): void { void this.router.navigate(['/security/users']); }
  errorMessage(error: ApiError): string { return securityErrorMessage(error, 'No fue posible completar la operación.'); }
}
