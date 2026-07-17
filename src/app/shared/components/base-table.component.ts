import { Component, input } from '@angular/core';

@Component({ selector: 'app-base-table', template: `<div class="table-wrapper"><table><caption>{{ caption() }}</caption><thead><tr>@for (column of columns(); track column) { <th scope="col">{{ column }}</th> }</tr></thead><tbody><ng-content /></tbody></table></div>` })
export class BaseTableComponent { readonly caption = input('Tabla de resultados'); readonly columns = input<string[]>([]); }
