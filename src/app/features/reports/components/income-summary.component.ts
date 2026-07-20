import { Component, input } from '@angular/core';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { formatMoney } from '../../../shared/utils/display-formatters';
import { IncomeByMethodResponse, IncomeTotalResponse } from '../models/report.models';

@Component({ selector: 'app-income-summary', imports: [EmptyStateComponent], template: `
  <section class="dashboard-section"><div class="section-heading"><div><h2>Ingresos de hoy</h2><p>Totales por moneda de la fecha operativa.</p></div></div>
    @if (incomeToday().length) { <div class="income-totals">@for (income of incomeToday(); track income.currency) { <article class="card income-total"><span>{{ income.currency }}</span><strong>{{ money(income.amount, income.currency) }}</strong></article> }</div> }
    @else { <app-empty-state title="Sin ingresos para mostrar" description="No hay totales de ingresos para la fecha operativa." /> }
  </section>
  <section class="dashboard-section"><div class="section-heading"><div><h2>Ingresos por método</h2><p>Desglose real de pagos por método y moneda.</p></div></div>
    @if (incomeByMethod().length) { <div class="card students-table-card income-method-table"><div class="table-wrapper"><table><caption>Ingresos por método de pago</caption><thead><tr><th scope="col">Método</th><th scope="col">Moneda</th><th scope="col">Pagos</th><th scope="col">Importe</th></tr></thead><tbody>@for (item of incomeByMethod(); track item.method + '-' + item.currency) { <tr><td data-label="Método">{{ methodLabel(item.method) }}</td><td data-label="Moneda">{{ item.currency }}</td><td data-label="Pagos">{{ item.payments }}</td><td data-label="Importe"><strong>{{ money(item.amount, item.currency) }}</strong></td></tr> }</tbody></table></div></div> }
    @else { <app-empty-state title="Sin desglose por método" description="No hay pagos agrupados por método para esta fecha." /> }
  </section>
` })
export class IncomeSummaryComponent {
  readonly incomeToday = input<IncomeTotalResponse[]>([]);
  readonly incomeByMethod = input<IncomeByMethodResponse[]>([]);
  money = formatMoney;
  methodLabel(value: string): string { return ({ CASH: 'Efectivo', TRANSFER: 'Transferencia', MANUAL_CARD: 'Tarjeta manual' } as Record<string, string>)[value.trim().toUpperCase()] ?? value; }
}
