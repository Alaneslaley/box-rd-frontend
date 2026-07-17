import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-payments-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Pagos" description="Registro y consulta de cobros." scope="Fase 1 integrará pagos, folios, recibos e idempotencia. Esta pantalla no procesa dinero ni calcula folios." phase="Fase 1" />` })
export class PaymentsPageComponent {}
