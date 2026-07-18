import { ApiError } from '../../../core/models/api-error.model';

export function reportErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 0) return 'No se pudo conectar con el servidor.';
  if (error.status === 400) return error.message || 'No fue posible consultar el reporte con los datos enviados.';
  if (error.status === 403) return 'No tienes permiso para consultar este reporte.';
  if (error.status === 404) return 'Reporte no encontrado.';
  if (error.status && error.status >= 500) return 'El servidor no pudo generar el reporte. Intenta más tarde.';
  return error.message || fallback;
}
