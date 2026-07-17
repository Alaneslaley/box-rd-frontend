import { Component } from '@angular/core';
import { FeaturePlaceholderPageComponent } from '../../shared/components/feature-placeholder-page.component';
@Component({ selector: 'app-security-page', imports: [FeaturePlaceholderPageComponent], template: `<app-feature-placeholder-page title="Seguridad" description="Usuarios, roles y permisos." scope="Fase 1 conectará usuarios y roles. Los controles web solo son de experiencia; la autorización final corresponde a la API." phase="Fase 1" />` })
export class SecurityPageComponent {}
