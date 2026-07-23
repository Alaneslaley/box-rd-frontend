import { ApiError } from '../../../core/models/api-error.model';
import { productErrorMessage } from '../../../core/http/api-error.mapper';

export function securityErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 404) return 'Usuario o rol no encontrado.';
  return productErrorMessage(error.status ?? -1, fallback);
}
