import { formatDate, formatDateTime, formatMoney } from './display-formatters';

describe('display formatters', () => {
  it('mantiene el día de un LocalDate sin convertirlo a UTC', () => {
    const formatted = formatDate('2026-01-02');
    expect(formatted).toContain('2');
    expect(formatted).toContain('2026');
  });

  it('respeta la moneda recibida', () => {
    expect(formatMoney(12.5, 'USD')).toContain('US');
    expect(formatMoney(12.5, 'MXN')).toContain('$');
  });

  it('usa un fallback humano para date-time ausente', () => expect(formatDateTime(null)).toBe('No disponible'));
});
