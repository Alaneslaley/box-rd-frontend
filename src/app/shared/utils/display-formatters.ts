export function formatMoney(amount: number, currency: string): string {
  try { return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount); }
  catch { return `${amount.toFixed(2)} ${currency}`; }
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return 'No disponible';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return 'No disponible';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(date);
}
