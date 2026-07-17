import { Component, input } from '@angular/core';

@Component({ selector: 'app-loading-state', template: `<section class="state-card loading-state" role="status"><span class="spinner" aria-hidden="true"></span><p>{{ message() }}</p></section>` })
export class LoadingStateComponent { readonly message = input('Cargando información…'); }
