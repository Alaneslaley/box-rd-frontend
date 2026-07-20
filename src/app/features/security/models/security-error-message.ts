import { ApiError } from '../../../core/models/api-error.model';

export function securityErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 0) return 'No se pudo conectar con el servidor.';
  if (error.status === 400) return Object.values(error.details ?? {})[0] || error.message || 'Revisa los datos capturados.';
  if (error.status === 403) return 'No tienes permiso para realizar esta acción.';
  if (error.status === 404) return 'Usuario o rol no encontrado.';
  if (error.status === 409) return error.message || 'La operación entra en conflicto con el estado actual.';
  if (error.status && error.status >= 500) return 'El servidor no pudo procesar la solicitud. Intenta más tarde.';
  return error.message || fallback;
}
