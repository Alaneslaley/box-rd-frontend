import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin, map } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { PlansApiService } from '../../plans/data-access/plans-api.service';
import { PlanSnapshot } from '../../plans/models/plan.models';
import { StudentsApiService } from '../../students/data-access/students-api.service';
import { StudentSummaryResponse } from '../../students/models/student.models';
import { MembershipCreateFormComponent } from '../components/membership-create-form.component';
import { MembershipsFacade } from '../data-access/memberships.facade';
import { membershipErrorMessage } from '../models/membership-error-message';
import { CreateMembershipRequest } from '../models/membership.models';

@Component({ selector: 'app-membership-create-page', imports: [PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, MembershipCreateFormComponent], template: `
  <app-page-header title="Nueva membresía" description="Asigna un plan activo a un alumno." />
  @if (loadingOptions()) { <app-loading-state message="Cargando alumnos y planes…" /> }
  @else if (optionsError(); as message) { <app-error-state title="No fue posible preparar el formulario" [message]="message" [traceId]="traceId()"><button class="btn btn-secondary" type="button" (click)="loadOptions()">Reintentar</button></app-error-state> }
  @else { @if (saveError(); as message) { <app-error-state title="No fue posible crear la membresía" [message]="message" [traceId]="traceId()" /> }
    @if (!students().length || !plans().length) { <section class="state-card warning-state"><h2>Catálogo incompleto</h2><p>Se requiere al menos un alumno y un plan activo para crear la membresía.</p></section> }
    <app-membership-create-form [students]="students()" [plans]="plans()" [initialStudentId]="initialStudentId" [saving]="saving()" (submitted)="save($event)" (cancelled)="cancel()" />
  }` })
export class MembershipCreatePageComponent implements OnInit {
  private readonly facade = inject(MembershipsFacade);
  private readonly studentsApi = inject(StudentsApiService);
  private readonly plansApi = inject(PlansApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly initialStudentId = this.route.snapshot.queryParamMap.get('studentId') ?? '';
  readonly loadingOptions = signal(true);
  readonly saving = signal(false);
  readonly students = signal<StudentSummaryResponse[]>([]);
  readonly plans = signal<PlanSnapshot[]>([]);
  readonly optionsError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly traceId = signal<string | undefined>(undefined);

  ngOnInit(): void { this.loadOptions(); }

  loadOptions(): void {
    this.loadingOptions.set(true); this.optionsError.set(null); this.traceId.set(undefined);
    const page$ = this.studentsApi.search({ page: 0, size: 100 });
    const students$ = this.initialStudentId
      ? forkJoin({ page: page$, selected: this.studentsApi.getById(this.initialStudentId) }).pipe(map(({ page, selected }) => page.content.some((student) => student.id === selected.id) ? page.content : [selected, ...page.content]))
      : page$.pipe(map((page) => page.content));
    forkJoin({ students: students$, plans: this.plansApi.list({ page: 0, size: 100, includeInactive: false }) }).pipe(finalize(() => this.loadingOptions.set(false))).subscribe({
      next: ({ students, plans }) => { this.students.set(students); this.plans.set(plans.content); },
      error: (error: ApiError) => { this.optionsError.set(membershipErrorMessage(error, 'No fue posible cargar alumnos y planes.')); this.traceId.set(error.traceId); },
    });
  }

  save(request: CreateMembershipRequest): void {
    if (this.saving()) return;
    this.saving.set(true); this.saveError.set(null); this.traceId.set(undefined);
    this.facade.createMembership(request).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (membership) => void this.router.navigate(this.initialStudentId ? ['/students', membership.studentId] : ['/memberships']),
      error: (error: ApiError) => { this.saveError.set(membershipErrorMessage(error, 'No fue posible crear la membresía.')); this.traceId.set(error.traceId); },
    });
  }

  cancel(): void { void this.router.navigate(this.initialStudentId ? ['/students', this.initialStudentId] : ['/memberships']); }
}
