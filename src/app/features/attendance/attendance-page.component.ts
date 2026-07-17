import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-attendance-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Asistencia" description="Consulta y registro de check-in." scope="Fase 1 consumirá decisiones explícitas de check-in del backend sin duplicar validaciones de vigencia o restricciones." phase="Fase 1" />` })
export class AttendancePageComponent {}
