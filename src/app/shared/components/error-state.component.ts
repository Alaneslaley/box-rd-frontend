import { Component, input } from '@angular/core';

@Component({ selector: 'app-error-state', template: `<section class="state-card error-state" role="alert"><h2>{{ title() }}</h2><p>{{ message() }}</p>@if (traceId()) { <small>Referencia de soporte: {{ traceId() }}</small> }<ng-content /></section>` })
export class ErrorStateComponent { readonly title = input('No fue posible cargar la información'); readonly message = input('Intenta nuevamente o contacta a soporte.'); readonly traceId = input<string>(); }
