import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({ selector: 'app-reports-page', imports: [RouterLink, PageHeaderComponent], template: `
  <app-page-header title="Reportes" description="Consulta reportes administrativos disponibles en el contrato actual." phase="Sprint 6" />
  <section class="report-catalog"><a class="card report-card report-card-active" routerLink="/reports/admin-dashboard"><span class="eyebrow">Disponible</span><h2>Dashboard administrativo</h2><p>KPIs diarios e ingresos agrupados por moneda y método.</p><span class="btn btn-link">Abrir reporte</span></a>
    <article class="card report-card"><span class="eyebrow">Pendiente para sprint posterior</span><h2>Ingresos por rango</h2><p>Requiere un endpoint con fechas y agregaciones históricas.</p></article>
    <article class="card report-card"><span class="eyebrow">Pendiente para sprint posterior</span><h2>Asistencia por periodo</h2><p>Requiere contrato de consulta histórica agregada.</p></article>
    <article class="card report-card"><span class="eyebrow">Pendiente para sprint posterior</span><h2>Membresías vencidas</h2><p>El endpoint actual solo devuelve el conteo diario.</p></article>
    <article class="card report-card"><span class="eyebrow">Pendiente para sprint posterior</span><h2>Alumnos activos e inactivos</h2><p>El contrato actual no ofrece este desglose.</p></article>
  </section>
` })
export class ReportsPageComponent {}
