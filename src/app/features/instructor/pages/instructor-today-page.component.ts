import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { ProtectedMediaImageComponent } from '../../../shared/media/protected-media-image.component';
import { formatDateTime } from '../../../shared/utils/display-formatters';
import { attendanceErrorMessage } from '../../attendance/models/attendance-error-message';
import { attendanceLevelLabel, attendanceStatusLabel, attendanceStatusTone, membershipSnapshotLabel, membershipSnapshotTone } from '../../attendance/models/attendance-labels';
import { InstructorFacade } from '../data-access/instructor.facade';

@Component({ selector: 'app-instructor-today-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent, ProtectedMediaImageComponent], template: `
  <app-page-header title="Instructor · Hoy" description="Vista rápida de alumnos que hicieron check-in en la jornada actual." phase="Sprint 5"><button class="btn btn-secondary" type="button" (click)="facade.loadToday()">Actualizar</button></app-page-header>
  @if (facade.loading()) { <app-loading-state message="Cargando alumnos presentes…" /> }
  @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadToday()">Reintentar</button></app-error-state> }
  @else if (!facade.page()?.content?.length) { <app-empty-state title="Aún no hay alumnos presentes" description="Los alumnos aparecerán cuando el backend confirme su check-in." /> }
  @else if (facade.page(); as page) { <section class="instructor-grid" aria-label="Alumnos presentes hoy">@for (item of page.content; track item.attendance.id) { <article class="card instructor-student-card"><app-protected-media-image [fileId]="item.photoFileId" [name]="item.studentName" [alt]="'Foto de ' + item.studentName" /><div class="instructor-student-info"><h2>{{ item.studentName }}</h2><p>{{ item.attendance.ageAtEvent }} años · {{ item.attendance.ageCategoryAtEvent }} · {{ levelLabel(item.attendance.levelAtEvent) }}</p><div class="badge-row"><app-status-badge [label]="statusLabel(item.attendance.status)" [tone]="statusTone(item.attendance.status)" /><app-status-badge [label]="membershipLabel(item.attendance.membershipStatusAtEvent)" [tone]="membershipTone(item.attendance.membershipStatusAtEvent)" /></div><small>Entrada: {{ dateTime(item.attendance.checkedInAt) }}</small><small>Vigencia: {{ item.attendance.membershipEndDateAtEvent || 'No disponible' }}</small><a class="btn btn-link" [routerLink]="['/students', item.attendance.studentId]">Ver alumno</a></div></article> }</section><nav class="pagination" aria-label="Paginación de alumnos presentes"><button class="btn btn-secondary" type="button" [disabled]="page.first" (click)="facade.changePage(page.page - 1)">Anterior</button><span>Página {{ page.page + 1 }} de {{ page.totalPages || 1 }} · {{ page.totalElements }} alumnos</span><button class="btn btn-secondary" type="button" [disabled]="page.last" (click)="facade.changePage(page.page + 1)">Siguiente</button></nav> }
` })
export class InstructorTodayPageComponent implements OnInit {
  readonly facade = inject(InstructorFacade); ngOnInit(): void { this.facade.loadToday(); }
  errorMessage(error: ApiError): string { return attendanceErrorMessage(error, 'No fue posible cargar la vista del instructor.'); }
  dateTime = formatDateTime; statusLabel = attendanceStatusLabel; statusTone = attendanceStatusTone; membershipLabel = membershipSnapshotLabel; membershipTone = membershipSnapshotTone; levelLabel = attendanceLevelLabel;
}
