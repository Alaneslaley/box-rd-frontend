import { ApiError } from '../../../core/models/api-error.model';
import { productErrorMessage } from '../../../core/http/api-error.mapper';

export function studentErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 404) return 'Alumno no encontrado.';
  return productErrorMessage(error.status ?? -1, fallback);
}
