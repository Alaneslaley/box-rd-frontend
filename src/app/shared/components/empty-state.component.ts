import { Component, input } from '@angular/core';

@Component({ selector: 'app-empty-state', template: `<section class="state-card empty-state"><h2>{{ title() }}</h2><p>{{ description() }}</p><ng-content /></section>` })
export class EmptyStateComponent { readonly title = input('Sin información disponible'); readonly description = input('Cuando haya datos para mostrar, aparecerán aquí.'); }
