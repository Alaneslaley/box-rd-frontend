import { ApiError } from '../../../core/models/api-error.model';
import { productErrorMessage } from '../../../core/http/api-error.mapper';

export function attendanceErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 404) return 'No se encontró el recurso solicitado.';
  return productErrorMessage(error.status ?? -1, fallback);
}
