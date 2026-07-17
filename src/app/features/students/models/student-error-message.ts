import { ApiError } from '../../../core/models/api-error.model';

export function studentErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 404) return 'Alumno no encontrado.';
  if (error.status === 400 || error.status === 409) return error.message || 'Revisa los datos capturados.';
  if (error.status === 403) return 'No tienes permiso para realizar esta acción.';
  if (error.status === 0) return 'No fue posible conectar con el servidor.';
  return fallback;
}
