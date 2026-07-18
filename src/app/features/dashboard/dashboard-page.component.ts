import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../core/auth/auth-session.store';
import { PERMISSIONS } from '../../core/auth/permissions';
import { ApiError } from '../../core/models/api-error.model';
import { ErrorStateComponent } from '../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { formatDateTime } from '../../shared/utils/display-formatters';
import { AdminDashboardViewComponent } from '../reports/components/admin-dashboard-view.component';
import { ReportsFacade } from '../reports/data-access/reports.facade';
import { reportErrorMessage } from '../reports/models/report-error-message';

@Component({ selector: 'app-dashboard-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, AdminDashboardViewComponent], template: `
  <app-page-header title="Dashboard administrativo" description="Indicadores operativos y financieros entregados por el backend." phase="Sprint 6"><button class="btn btn-secondary" type="button" [disabled]="facade.loading()" (click)="facade.refreshDashboard()">{{ facade.loading() ? 'Actualizando…' : 'Refrescar' }}</button></app-page-header>
  @if (facade.lastUpdatedAt(); as updatedAt) { <p class="dashboard-updated" aria-live="polite">Última actualización: {{ dateTime(updatedAt) }}</p> }
  @if (facade.loading() && !facade.data()) { <app-loading-state message="Cargando dashboard…" /> }
  @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadDashboard()">Reintentar</button></app-error-state> }
  @else if (facade.data(); as data) {
    <app-admin-dashboard-view [data]="data" />
    <section class="dashboard-section"><div class="section-heading"><div><h2>Accesos rápidos</h2><p>Navega a los módulos habilitados para tu sesión.</p></div></div><div class="quick-actions">
      @if (canStudents) { <a class="card quick-action" routerLink="/students"><strong>Alumnos</strong><span>Consultar expedientes</span></a> }
      @if (canMemberships) { <a class="card quick-action" routerLink="/memberships"><strong>Membresías</strong><span>Consultar vigencias</span></a> }
      @if (canPayments) { <a class="card quick-action" routerLink="/payments"><strong>Pagos</strong><span>Revisar registros</span></a> }
      @if (canCash) { <a class="card quick-action" routerLink="/cash"><strong>Caja</strong><span>Ver estado actual</span></a> }
      @if (canAttendance) { <a class="card quick-action" routerLink="/attendance"><strong>Asistencia</strong><span>Ver entradas de hoy</span></a> }
      @if (canReports) { <a class="card quick-action" routerLink="/reports"><strong>Reportes</strong><span>Abrir módulo</span></a> }
    </div></section>
  }
` })
export class DashboardPageComponent implements OnInit {
  readonly facade = inject(ReportsFacade); private readonly session = inject(AuthSessionStore);
  readonly canStudents = this.session.hasPermission(PERMISSIONS.STUDENTS_VIEW); readonly canMemberships = this.session.hasPermission(PERMISSIONS.MEMBERSHIPS_VIEW); readonly canPayments = this.session.hasPermission(PERMISSIONS.PAYMENTS_READ); readonly canCash = this.session.hasPermission(PERMISSIONS.CASH_READ); readonly canAttendance = this.session.hasPermission(PERMISSIONS.ATTENDANCE_READ); readonly canReports = this.session.hasAnyPermission([PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_ADMIN_DASHBOARD]);
  ngOnInit(): void { this.facade.loadDashboard(); }
  errorMessage(error: ApiError): string { return reportErrorMessage(error, 'No fue posible cargar el dashboard administrativo.'); }
  dateTime = formatDateTime;
}
