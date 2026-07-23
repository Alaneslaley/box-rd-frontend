import { ApiError } from '../../../core/models/api-error.model';
import { productErrorMessage } from '../../../core/http/api-error.mapper';

export function membershipErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 404) return 'La membresía solicitada no fue encontrada.';
  return productErrorMessage(error.status ?? -1, fallback);
}
