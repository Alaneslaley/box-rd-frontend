import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { DisplayNameResolverService } from '../../../core/display/display-name-resolver.service';
import { ApiError } from '../../../core/models/api-error.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { formatDateTime } from '../../../shared/utils/display-formatters';
import { AttendanceFacade } from '../data-access/attendance.facade';
import { attendanceErrorMessage } from '../models/attendance-error-message';
import { attendanceLevelLabel, attendanceStatusLabel, attendanceStatusTone, membershipSnapshotLabel, membershipSnapshotTone } from '../models/attendance-labels';

@Component({ selector: 'app-attendance-today-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, StatusBadgeComponent], template: `
  <app-page-header title="Asistencia de hoy" description="Registros de entrada de la fecha operativa actual.">
    <div class="header-actions"><button class="btn btn-secondary" type="button" (click)="facade.loadToday()">Actualizar</button>@if (canCheckIn) { <a class="btn btn-primary" routerLink="/attendance/check-in">Registrar check-in</a> }</div>
  </app-page-header>
  @if (facade.loading()) { <app-loading-state message="Cargando asistencias…" /> }
  @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadToday()">Reintentar</button></app-error-state> }
  @else if (!facade.page()?.content?.length) { <app-empty-state title="No hay asistencias registradas hoy" description="Los check-ins confirmados aparecerán aquí.">@if (canCheckIn) { <a class="btn btn-primary" routerLink="/attendance/check-in">Registrar check-in</a> }</app-empty-state> }
  @else if (facade.page(); as page) {
    <section class="card students-table-card attendance-table"><div class="table-wrapper"><table><caption>Asistencia registrada hoy</caption><thead><tr><th>Hora</th><th>Alumno</th><th>Estado</th><th>Edad al evento</th><th>Nivel</th><th>Membresía</th><th>Vencimiento</th><th>Acciones</th></tr></thead><tbody>
      @for (item of page.content; track item.id) { <tr><td data-label="Hora">{{ dateTime(item.checkedInAt) }}</td><td data-label="Alumno"><a [routerLink]="['/students', item.studentId]">{{ display.studentName(item.studentName) }}</a></td><td data-label="Estado"><app-status-badge [label]="statusLabel(item.status)" [tone]="statusTone(item.status)" /></td><td data-label="Edad">{{ item.ageAtEvent }} años · {{ item.ageCategoryAtEvent }}</td><td data-label="Nivel">{{ levelLabel(item.levelAtEvent) }}</td><td data-label="Membresía"><app-status-badge [label]="membershipLabel(item.membershipStatusAtEvent)" [tone]="membershipTone(item.membershipStatusAtEvent)" /></td><td data-label="Vencimiento">{{ item.membershipEndDateAtEvent || 'No disponible' }}</td><td data-label="Acciones"><a class="btn btn-link" [routerLink]="['/attendance/student', item.studentId]">Ver historial</a></td></tr> }
    </tbody></table></div><nav class="pagination" aria-label="Paginación de asistencias"><button class="btn btn-secondary" type="button" [disabled]="page.first" (click)="facade.changePage(page.page - 1)">Anterior</button><span>Página {{ page.page + 1 }} de {{ page.totalPages || 1 }} · {{ page.totalElements }} registros</span><button class="btn btn-secondary" type="button" [disabled]="page.last" (click)="facade.changePage(page.page + 1)">Siguiente</button></nav></section>
  }
` })
export class AttendanceTodayPageComponent implements OnInit {
  readonly facade = inject(AttendanceFacade); readonly display = inject(DisplayNameResolverService); private readonly session = inject(AuthSessionStore);
  readonly canCheckIn = this.session.hasPermission(PERMISSIONS.ATTENDANCE_CHECKIN);
  ngOnInit(): void { this.facade.loadToday(); }
  errorMessage(error: ApiError): string { return attendanceErrorMessage(error, 'No fue posible cargar la asistencia de hoy.'); }
  dateTime = formatDateTime; statusLabel = attendanceStatusLabel; statusTone = attendanceStatusTone; membershipLabel = membershipSnapshotLabel; membershipTone = membershipSnapshotTone; levelLabel = attendanceLevelLabel;
}
