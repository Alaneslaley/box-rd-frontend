import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-students-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Alumnos" description="Gestión de expedientes de alumnos." scope="Fase 1 incorporará listado, alta, edición, foto y datos de tutor con validación definitiva del backend." phase="Fase 1" />` })
export class StudentsPageComponent {}
