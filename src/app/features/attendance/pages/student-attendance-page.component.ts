import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { DisplayNameResolverService } from '../../../core/display/display-name-resolver.service';
import { PageResponse } from '../../../core/models/page-response.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { formatDateTime } from '../../../shared/utils/display-formatters';
import { AttendanceFacade } from '../data-access/attendance.facade';
import { attendanceErrorMessage } from '../models/attendance-error-message';
import { attendanceLevelLabel, attendanceStatusLabel, attendanceStatusTone, membershipSnapshotLabel, membershipSnapshotTone } from '../models/attendance-labels';
import { AttendanceResponse } from '../models/attendance.models';

@Component({ selector: 'app-student-attendance-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  <app-page-header title="Historial de asistencia" [description]="display.studentName(studentId)" ><div class="header-actions"><a class="btn btn-secondary" [routerLink]="['/students', studentId]">Volver al alumno</a><a class="btn btn-primary" routerLink="/attendance/check-in" [queryParams]="{ studentId: studentId }">Registrar check-in</a></div></app-page-header>
  @if (loading()) { <app-loading-state message="Cargando historial…" /> }
  @else if (error(); as currentError) { <app-error-state [message]="errorMessage(currentError)" [traceId]="currentError.traceId"><button class="btn btn-secondary" type="button" (click)="load(page()?.page || 0)">Reintentar</button></app-error-state> }
  @else if (!page()?.content?.length) { <app-empty-state title="Sin asistencias registradas" description="Este alumno todavía no tiene registros de asistencia." /> }
  @else if (page(); as currentPage) { <section class="card students-table-card attendance-table"><div class="table-wrapper"><table><caption>Historial del alumno</caption><thead><tr><th>Fecha</th><th>Hora</th><th>Estado</th><th>Edad al evento</th><th>Nivel</th><th>Membresía</th><th>Vencimiento</th></tr></thead><tbody>
    @for (item of currentPage.content; track item.id) { <tr><td data-label="Fecha">{{ item.attendanceDate }}</td><td data-label="Hora">{{ dateTime(item.checkedInAt) }}</td><td data-label="Estado"><app-status-badge [label]="statusLabel(item.status)" [tone]="statusTone(item.status)" /></td><td data-label="Edad">{{ item.ageAtEvent }} años · {{ item.ageCategoryAtEvent }}</td><td data-label="Nivel">{{ levelLabel(item.levelAtEvent) }}</td><td data-label="Membresía"><app-status-badge [label]="membershipLabel(item.membershipStatusAtEvent)" [tone]="membershipTone(item.membershipStatusAtEvent)" /></td><td data-label="Vencimiento">{{ item.membershipEndDateAtEvent || 'No disponible' }}</td></tr> }
  </tbody></table></div><nav class="pagination" aria-label="Paginación del historial"><button class="btn btn-secondary" type="button" [disabled]="currentPage.first" (click)="load(currentPage.page - 1)">Anterior</button><span>Página {{ currentPage.page + 1 }} de {{ currentPage.totalPages || 1 }} · {{ currentPage.totalElements }} registros</span><button class="btn btn-secondary" type="button" [disabled]="currentPage.last" (click)="load(currentPage.page + 1)">Siguiente</button></nav></section> }
` })
export class StudentAttendancePageComponent implements OnInit {
  private readonly facade = inject(AttendanceFacade); private readonly route = inject(ActivatedRoute); readonly display = inject(DisplayNameResolverService);
  readonly studentId = this.route.snapshot.paramMap.get('studentId') ?? ''; readonly page = signal<PageResponse<AttendanceResponse> | null>(null); readonly loading = signal(false); readonly error = signal<ApiError | null>(null);
  ngOnInit(): void { this.display.preloadStudentNames([this.studentId]); this.load(0); }
  load(page: number): void { if (!this.studentId || page < 0) return; this.loading.set(true); this.error.set(null); this.facade.loadByStudent({ studentId: this.studentId, page, size: 20 }).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (result) => this.page.set(result), error: (error: ApiError) => this.error.set(error) }); }
  errorMessage(error: ApiError): string { return attendanceErrorMessage(error, 'No fue posible cargar el historial del alumno.'); }
  dateTime = formatDateTime; statusLabel = attendanceStatusLabel; statusTone = attendanceStatusTone; membershipLabel = membershipSnapshotLabel; membershipTone = membershipSnapshotTone; levelLabel = attendanceLevelLabel;
}
