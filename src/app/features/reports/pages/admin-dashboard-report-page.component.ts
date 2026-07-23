import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiError } from '../../../core/models/api-error.model';
import { ErrorStateComponent } from '../../../shared/components/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { formatDateTime } from '../../../shared/utils/display-formatters';
import { AdminDashboardViewComponent } from '../components/admin-dashboard-view.component';
import { ReportsFacade } from '../data-access/reports.facade';
import { reportErrorMessage } from '../models/report-error-message';

@Component({ selector: 'app-admin-dashboard-report-page', imports: [RouterLink, PageHeaderComponent, LoadingStateComponent, ErrorStateComponent, AdminDashboardViewComponent], template: `
  <app-page-header title="Reporte administrativo" description="Vista detallada de los indicadores diarios disponibles."><div class="header-actions"><a class="btn btn-secondary" routerLink="/dashboard">Volver al dashboard</a><button class="btn btn-primary" type="button" [disabled]="facade.loading()" (click)="facade.refreshDashboard()">{{ facade.loading() ? 'Actualizando…' : 'Refrescar' }}</button></div></app-page-header>
  @if (facade.lastUpdatedAt(); as updatedAt) { <p class="dashboard-updated" aria-live="polite">Última actualización: {{ dateTime(updatedAt) }}</p> }
  @if (facade.loading() && !facade.data()) { <app-loading-state message="Generando reporte…" /> }
  @else if (facade.error(); as error) { <app-error-state [message]="errorMessage(error)" [traceId]="error.traceId"><button class="btn btn-secondary" type="button" (click)="facade.loadDashboard()">Reintentar</button></app-error-state> }
  @else if (facade.data(); as data) { <app-admin-dashboard-view [data]="data" /> }
` })
export class AdminDashboardReportPageComponent implements OnInit {
  readonly facade = inject(ReportsFacade);
  ngOnInit(): void { this.facade.loadDashboard(); }
  errorMessage(error: ApiError): string { return reportErrorMessage(error, 'No fue posible generar el reporte administrativo.'); }
  dateTime = formatDateTime;
}
