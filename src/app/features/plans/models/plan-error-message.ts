import { ApiError } from '../../../core/models/api-error.model';

export function planErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 400) return error.message || 'Revisa los datos del plan e intenta nuevamente.';
  if (error.status === 403) return 'No tienes permiso para realizar esta acción.';
  if (error.status === 404) return 'El plan solicitado no fue encontrado.';
  if (error.status && error.status >= 500) return 'El servidor no pudo procesar la solicitud. Intenta más tarde.';
  return error.message || fallback;
}
