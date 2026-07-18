import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type KpiTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-kpi-card',
  imports: [RouterLink],
  template: `
    @if (route(); as target) {
      <a [routerLink]="target" [class]="cardClass()" [attr.aria-label]="title() + ': ' + value()">
        <span class="kpi-title">{{ title() }}</span><strong class="kpi-value">{{ value() }}</strong><span class="kpi-subtitle">{{ subtitle() }}</span><span class="kpi-link">Abrir módulo</span>
      </a>
    } @else {
      <article [class]="cardClass()" [attr.aria-label]="title() + ': ' + value()">
        <span class="kpi-title">{{ title() }}</span><strong class="kpi-value">{{ value() }}</strong><span class="kpi-subtitle">{{ subtitle() }}</span>
      </article>
    }
  `,
})
export class KpiCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly subtitle = input('');
  readonly tone = input<KpiTone>('neutral');
  readonly route = input<string | null>(null);
  cardClass(): string { return `kpi-card kpi-tone-${this.tone()}`; }
}
