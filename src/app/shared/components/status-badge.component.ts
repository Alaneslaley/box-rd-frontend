import { Component, input } from '@angular/core';

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';
@Component({ selector: 'app-status-badge', template: `<span class="status-badge" [class]="'status-badge tone-' + tone()">{{ label() }}</span>` })
export class StatusBadgeComponent { readonly label = input.required<string>(); readonly tone = input<StatusTone>('neutral'); }
