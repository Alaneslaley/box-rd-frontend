import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-memberships-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Membresías" description="Planes, vigencias y renovaciones." scope="Fase 1 conectará planes y membresías; la vigencia definitiva siempre será calculada por el backend." phase="Fase 1" />` })
export class MembershipsPageComponent {}
