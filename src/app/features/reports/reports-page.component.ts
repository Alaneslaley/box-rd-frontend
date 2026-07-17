import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-reports-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Reportes" description="Lectura de información administrativa." scope="Fase 1 mostrará reportes entregados por la API; no se fabrican KPIs ni cálculos financieros en el cliente." phase="Fase 1" />` })
export class ReportsPageComponent {}
