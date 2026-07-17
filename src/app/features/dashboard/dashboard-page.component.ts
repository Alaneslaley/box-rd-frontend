import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-dashboard-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Dashboard" description="Resumen administrativo y operativo." scope="Preparado para indicadores reales entregados por el backend; no se muestran métricas simuladas." phase="Fase 1" />` })
export class DashboardPageComponent {}
