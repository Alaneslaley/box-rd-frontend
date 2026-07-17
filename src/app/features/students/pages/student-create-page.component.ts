import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StudentFormComponent } from '../components/student-form.component';
import { StudentsFacade } from '../data-access/students.facade';
import { studentErrorMessage } from '../models/student-error-message';
import { StudentCreateRequest, StudentUpdateRequest } from '../models/student.models';

@Component({ selector: 'app-student-create-page', imports: [PageHeaderComponent, ErrorStateComponent, StudentFormComponent], template: `
  <app-page-header title="Nuevo alumno" description="Crea el expediente administrativo básico del alumno." phase="Sprint 2" />
  @if (error(); as message) { <app-error-state title="No fue posible guardar el alumno" [message]="message" [traceId]="traceId()" /> }
  <app-student-form [saving]="saving()" submitLabel="Crear alumno" (submitted)="save($event)" (cancelled)="cancel()" />` })
export class StudentCreatePageComponent {
  private readonly facade = inject(StudentsFacade); private readonly session = inject(AuthSessionStore); private readonly router = inject(Router);
  readonly saving = signal(false); readonly error = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined);

  save(formValue: StudentUpdateRequest): void {
    this.saving.set(true); this.error.set(null); this.traceId.set(undefined);
    const branchId = this.session.user()?.branchId;
    const request: StudentCreateRequest = { ...formValue, ...(branchId ? { branchId } : {}) };
    this.facade.createStudent(request).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (student) => void this.router.navigate(['/students', student.id]),
      error: (error: ApiError) => { this.error.set(studentErrorMessage(error, 'No fue posible crear el alumno.')); this.traceId.set(error.traceId); },
    });
  }
  cancel(): void { void this.router.navigate(['/students']); }
}
