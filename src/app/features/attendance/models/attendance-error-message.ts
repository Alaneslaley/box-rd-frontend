import { ApiError } from '../../../core/models/api-error.model';

export function attendanceErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 0) return 'No se pudo conectar con el servidor.';
  if (error.status === 404) return 'No se encontró el recurso solicitado.';
  if (error.status === 409) return error.message || 'La operación entra en conflicto con el estado actual.';
  if (error.status === 400) return Object.values(error.details ?? {})[0] || error.message || 'Revisa la información capturada.';
  if (error.status && error.status >= 500) return 'Ocurrió un error en el servidor. Intenta nuevamente.';
  return error.message || fallback;
}
