import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-cash-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Caja" description="Operación de turnos de caja." scope="Fase 1 integrará apertura, consulta y cierre. Los montos esperados y diferencias son responsabilidad exclusiva del backend." phase="Fase 1" />` })
export class CashPageComponent {}
