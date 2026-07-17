import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StudentFormComponent } from '../components/student-form.component';
import { StudentsFacade } from '../data-access/students.facade';
import { studentErrorMessage } from '../models/student-error-message';
import { StudentResponse, StudentUpdateRequest } from '../models/student.models';

@Component({ selector: 'app-student-edit-page', imports: [PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, StudentFormComponent], template: `
  <app-page-header title="Editar alumno" description="Actualiza los datos básicos autorizados del expediente." phase="Sprint 2" />
  @if (loading()) { <app-loading-state message="Cargando expediente…" /> }
  @else if (loadError(); as message) { <app-error-state [message]="message" [traceId]="traceId()" /> }
  @else if (student(); as currentStudent) {
    @if (saveError(); as message) { <app-error-state title="No fue posible guardar los cambios" [message]="message" [traceId]="traceId()" /> }
    <app-student-form [student]="currentStudent" [saving]="saving()" submitLabel="Guardar cambios" (submitted)="save($event)" (cancelled)="cancel()" />
  }` })
export class StudentEditPageComponent implements OnInit {
  private readonly facade = inject(StudentsFacade); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router);
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly loading = signal(true); readonly saving = signal(false); readonly student = signal<StudentResponse | null>(null);
  readonly loadError = signal<string | null>(null); readonly saveError = signal<string | null>(null); readonly traceId = signal<string | undefined>(undefined);

  ngOnInit(): void { this.facade.loadDetail(this.id).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (student) => this.student.set(student), error: (error: ApiError) => { this.loadError.set(studentErrorMessage(error, 'No fue posible cargar el alumno.')); this.traceId.set(error.traceId); } }); }
  save(request: StudentUpdateRequest): void { this.saving.set(true); this.saveError.set(null); this.traceId.set(undefined); this.facade.updateStudent(this.id, request).pipe(finalize(() => this.saving.set(false))).subscribe({ next: (student) => void this.router.navigate(['/students', student.id]), error: (error: ApiError) => { this.saveError.set(studentErrorMessage(error, 'No fue posible actualizar el alumno.')); this.traceId.set(error.traceId); } }); }
  cancel(): void { void this.router.navigate(['/students', this.id]); }
}
