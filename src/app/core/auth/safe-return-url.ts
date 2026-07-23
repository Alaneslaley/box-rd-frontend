/** Solo permite navegación interna absoluta y evita esquemas o rutas protocol-relative. */
export function safeReturnUrl(value: string | null | undefined, fallback = '/dashboard'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\r\n\\]/.test(value)) return fallback;
  return value;
}
