import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({ selector: 'app-reports-page', imports: [RouterLink, PageHeaderComponent], template: `
  <app-page-header title="Reportes" description="Consulta los reportes administrativos disponibles." />
  <section class="report-catalog"><a class="card report-card report-card-active" routerLink="/reports/admin-dashboard"><span class="eyebrow">Disponible</span><h2>Dashboard administrativo</h2><p>KPIs diarios e ingresos agrupados por moneda y método.</p><span class="btn btn-link">Abrir reporte</span></a>
    <article class="card report-card"><span class="eyebrow">Disponible próximamente</span><h2>Ingresos por rango</h2><p>Consulta histórica por periodos.</p></article>
    <article class="card report-card"><span class="eyebrow">Disponible próximamente</span><h2>Asistencia por periodo</h2><p>Resumen histórico de asistencia.</p></article>
    <article class="card report-card"><span class="eyebrow">Disponible próximamente</span><h2>Membresías vencidas</h2><p>Seguimiento detallado de vigencias.</p></article>
    <article class="card report-card"><span class="eyebrow">Disponible próximamente</span><h2>Alumnos activos e inactivos</h2><p>Resumen de alumnos por estado.</p></article>
  </section>
` })
export class ReportsPageComponent {}
