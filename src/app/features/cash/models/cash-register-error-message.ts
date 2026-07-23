import { ApiError } from '../../../core/models/api-error.model';
import { productErrorMessage } from '../../../core/http/api-error.mapper';

export function cashRegisterErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 404) return 'No se encontró la caja solicitada.';
  return productErrorMessage(error.status ?? -1, fallback);
}
