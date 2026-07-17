import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-sports-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Deportivo" description="Programas, ciclos y seguimiento deportivo." scope="Reservado para Fase 3: ciclos, sesiones, grupos, evaluaciones, RPE y observaciones técnicas." phase="Fase 3" tone="warning" />` })
export class SportsPageComponent {}
