import { Component, input } from '@angular/core';
import { EmptyStateComponent } from './empty-state.component';
import { PageHeaderComponent } from './page-header.component';
import { StatusBadgeComponent } from './status-badge.component';

@Component({ selector: 'app-feature-placeholder-page', imports: [PageHeaderComponent, EmptyStateComponent, StatusBadgeComponent], template: `
  <app-page-header [title]="title()" [description]="description()" [phase]="phase()"><app-status-badge [label]="phase()" [tone]="tone()" /></app-page-header>
  <section class="card"><h2>Base preparada</h2><p>{{ scope() }}</p></section>
  <app-empty-state [title]="'Pendiente de ' + phase()" [description]="pendingMessage()" />` })
export class FeaturePlaceholderPageComponent {
  readonly title = input.required<string>(); readonly description = input.required<string>(); readonly scope = input.required<string>(); readonly phase = input('Fase 1'); readonly tone = input<'info' | 'warning'>('info');
  pendingMessage(): string { return `Esta sección es un placeholder técnico; se conectará a la API cuando inicie ${this.phase()}.`; }
}
