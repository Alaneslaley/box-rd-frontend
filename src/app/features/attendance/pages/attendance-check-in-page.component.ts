import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { ProtectedMediaImageComponent } from '../../../shared/media/protected-media-image.component';
import { formatDateTime } from '../../../shared/utils/display-formatters';
import { StudentsApiService } from '../../students/data-access/students-api.service';
import { StudentSummaryResponse } from '../../students/models/student.models';
import { AttendanceCheckInFormComponent } from '../components/attendance-check-in-form.component';
import { AttendanceFacade } from '../data-access/attendance.facade';
import { attendanceErrorMessage } from '../models/attendance-error-message';
import { attendanceLevelLabel, attendanceStatusLabel, attendanceStatusTone, checkInDecisionLabel, checkInDecisionTone, membershipSnapshotLabel, membershipSnapshotTone } from '../models/attendance-labels';

@Component({ selector: 'app-attendance-check-in-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, StatusBadgeComponent, ProtectedMediaImageComponent, AttendanceCheckInFormComponent], template: `
  <app-page-header title="Registrar check-in" description="Selecciona al alumno; el backend decide y registra la asistencia." phase="Sprint 5"><a class="btn btn-secondary" routerLink="/attendance">Volver</a></app-page-header>
  @if (studentsLoading()) { <app-loading-state message="Cargando alumnos…" /> }
  @else {
    @if (studentsError(); as message) { <app-error-state title="No fue posible cargar el catálogo" [message]="message" [traceId]="studentsTraceId()"><button class="btn btn-secondary" type="button" (click)="loadStudents()">Reintentar</button></app-error-state> }
    <app-attendance-check-in-form [students]="students()" [preselectedStudentId]="preselectedStudentId" [saving]="saving()" (checkIn)="register($event)" />
  }
  @if (submitError(); as message) { <app-error-state title="No fue posible registrar el check-in" [message]="message" [traceId]="submitTraceId()" /> }
  @if (facade.lastCheckIn(); as result) {
    <section class="card checkin-result" aria-live="polite"><div class="checkin-identity"><app-protected-media-image [fileId]="result.photoFileId" [name]="result.studentName" [alt]="'Foto de ' + result.studentName" /><div><p class="eyebrow">Resultado del backend</p><h2>{{ result.studentName }}</h2><app-status-badge [label]="decisionLabel(result.decision)" [tone]="decisionTone(result.decision)" /></div></div>
      <dl><div><dt>Estado de asistencia</dt><dd><app-status-badge [label]="statusLabel(result.attendance.status)" [tone]="statusTone(result.attendance.status)" /></dd></div><div><dt>Registro</dt><dd>{{ dateTime(result.attendance.checkedInAt) }}</dd></div><div><dt>Edad</dt><dd>{{ result.age }} años · {{ result.ageCategory }}</dd></div><div><dt>Nivel</dt><dd>{{ levelLabel(result.level) }}</dd></div><div><dt>Membresía</dt><dd><app-status-badge [label]="membershipLabel(result.membershipStatus)" [tone]="membershipTone(result.membershipStatus)" /></dd></div><div><dt>Vencimiento</dt><dd>{{ result.membershipEndDate || 'No disponible' }}</dd></div></dl>
      <div class="form-actions"><a class="btn btn-secondary" [routerLink]="['/attendance/student', result.attendance.studentId]">Ver historial</a></div>
    </section>
  }
` })
export class AttendanceCheckInPageComponent implements OnInit {
  readonly facade = inject(AttendanceFacade); private readonly studentsApi = inject(StudentsApiService); private readonly route = inject(ActivatedRoute);
  readonly students = signal<StudentSummaryResponse[]>([]); readonly studentsLoading = signal(true); readonly studentsError = signal<string | null>(null); readonly studentsTraceId = signal<string | undefined>(undefined);
  readonly saving = signal(false); readonly submitError = signal<string | null>(null); readonly submitTraceId = signal<string | undefined>(undefined);
  readonly preselectedStudentId = this.route.snapshot.queryParamMap.get('studentId');
  ngOnInit(): void { this.facade.clearCheckInResult(); this.loadStudents(); }
  loadStudents(): void { this.studentsLoading.set(true); this.studentsError.set(null); this.studentsApi.search({ page: 0, size: 100 }).pipe(finalize(() => this.studentsLoading.set(false))).subscribe({ next: (page) => this.students.set(page.content), error: (error: ApiError) => { this.studentsError.set(attendanceErrorMessage(error, 'No fue posible cargar los alumnos.')); this.studentsTraceId.set(error.traceId); } }); }
  register(studentId: string): void { if (this.saving()) return; this.saving.set(true); this.submitError.set(null); this.submitTraceId.set(undefined); this.facade.clearCheckInResult(); this.facade.checkIn({ studentId }).pipe(finalize(() => this.saving.set(false))).subscribe({ error: (error: ApiError) => { this.submitError.set(attendanceErrorMessage(error, 'No fue posible registrar el check-in.')); this.submitTraceId.set(error.traceId); } }); }
  dateTime = formatDateTime; decisionLabel = checkInDecisionLabel; decisionTone = checkInDecisionTone; statusLabel = attendanceStatusLabel; statusTone = attendanceStatusTone; membershipLabel = membershipSnapshotLabel; membershipTone = membershipSnapshotTone; levelLabel = attendanceLevelLabel;
}
