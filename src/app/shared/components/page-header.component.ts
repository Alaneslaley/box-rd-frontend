import { Component, input } from '@angular/core';

@Component({ selector: 'app-page-header', template: `<header class="page-header"><div><h1>{{ title() }}</h1><p>{{ description() }}</p></div><ng-content /></header>` })
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  /** Compatibilidad temporal para las pantallas existentes; no se muestra en la interfaz. */
  readonly phase = input('');
}
