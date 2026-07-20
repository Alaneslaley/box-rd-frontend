import { Component, input } from '@angular/core';
import { EmptyStateComponent } from './empty-state.component';
import { PageHeaderComponent } from './page-header.component';
import { StatusBadgeComponent } from './status-badge.component';

@Component({ selector: 'app-feature-placeholder-page', imports: [PageHeaderComponent, EmptyStateComponent, StatusBadgeComponent], template: `
  <app-page-header [title]="title()" [description]="description()"><app-status-badge label="Próximamente" [tone]="tone()" /></app-page-header>
  <section class="card"><h2>En preparación</h2><p>{{ scope() }}</p></section>
  <app-empty-state title="Disponible próximamente" [description]="pendingMessage()" />` })
export class FeaturePlaceholderPageComponent {
  readonly title = input.required<string>(); readonly description = input.required<string>(); readonly scope = input.required<string>(); readonly phase = input(''); readonly tone = input<'info' | 'warning'>('info');
  pendingMessage(): string { return 'Esta sección estará disponible próximamente.'; }
}
