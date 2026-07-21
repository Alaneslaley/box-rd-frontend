import { Component, inject, input } from '@angular/core';
import { AuthSessionStore } from '../../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../../core/auth/permissions';
import { DisplayNameResolverService } from '../../../core/display/display-name-resolver.service';
import { KpiCardComponent, KpiTone } from '../../../shared/components/kpi-card.component';
import { formatDate } from '../../../shared/utils/display-formatters';
import { AdminDashboardResponse } from '../models/report.models';
import { IncomeSummaryComponent } from './income-summary.component';

@Component({ selector: 'app-admin-dashboard-view', imports: [KpiCardComponent, IncomeSummaryComponent], template: `
  <section class="dashboard-context" aria-label="Contexto del reporte"><span>Fecha operativa: <strong>{{ date(data().businessDate) }}</strong></span><span>Sucursal: <strong>{{ display.branchLabel(data().branchName, 'Sucursal actual') }}</strong></span></section>
  <section class="kpi-grid" aria-label="Indicadores administrativos">
    <app-kpi-card title="Alumnos activos" [value]="data().activeStudents" subtitle="Expedientes activos" tone="success" [route]="canStudents ? '/students' : null" />
    <app-kpi-card title="Membresías vencidas" [value]="data().expiredMemberships" [subtitle]="expiredSubtitle()" [tone]="expiredTone()" [route]="canMemberships ? '/memberships' : null" />
    <app-kpi-card title="Pagos de hoy" [value]="data().paymentsToday" subtitle="Pagos registrados en la fecha operativa" tone="primary" [route]="canPayments ? '/payments' : null" />
    <app-kpi-card title="Asistencias de hoy" [value]="data().attendanceToday" subtitle="Entradas registradas" tone="primary" [route]="canAttendance ? '/attendance' : null" />
  </section>
  <app-income-summary [incomeToday]="data().incomeToday" [incomeByMethod]="data().incomeByMethod" />
` })
export class AdminDashboardViewComponent {
  private readonly session = inject(AuthSessionStore);
  readonly display = inject(DisplayNameResolverService);
  readonly data = input.required<AdminDashboardResponse>();
  readonly canStudents = this.session.hasPermission(PERMISSIONS.STUDENTS_VIEW);
  readonly canMemberships = this.session.hasPermission(PERMISSIONS.MEMBERSHIPS_VIEW);
  readonly canPayments = this.session.hasPermission(PERMISSIONS.PAYMENTS_READ);
  readonly canAttendance = this.session.hasPermission(PERMISSIONS.ATTENDANCE_READ);
  date = formatDate;
  expiredTone(): KpiTone { return this.data().expiredMemberships > 0 ? 'warning' : 'success'; }
  expiredSubtitle(): string { return this.data().expiredMemberships > 0 ? 'Requieren seguimiento' : 'Sin vencimientos pendientes'; }
}
