export function formatMoney(amount: number, currency: string): string {
  try { return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount); }
  catch { return `${amount.toFixed(2)} ${currency}`; }
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return 'No disponible';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
