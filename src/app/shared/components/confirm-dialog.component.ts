import { Component, input, output } from '@angular/core';

/** Placeholder accesible; se reemplazará por un adaptador Material/CDK si se adopta ese kit. */
@Component({ selector: 'app-confirm-dialog', template: `@if (open()) { <section class="confirm-placeholder" role="dialog" aria-modal="true" [attr.aria-label]="title()"><h2>{{ title() }}</h2><p>{{ message() }}</p><div><button class="btn btn-secondary" type="button" (click)="cancelled.emit()">Cancelar</button><button class="btn btn-primary" type="button" (click)="confirmed.emit()">Confirmar</button></div></section> }` })
export class ConfirmDialogComponent { readonly open = input(false); readonly title = input('Confirmar acción'); readonly message = input('Esta acción requiere confirmación.'); readonly confirmed = output<void>(); readonly cancelled = output<void>(); }
