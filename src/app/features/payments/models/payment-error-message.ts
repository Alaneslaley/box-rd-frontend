import { ApiError } from '../../../core/models/api-error.model';
import { productErrorMessage } from '../../../core/http/api-error.mapper';

export function paymentErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 404) return 'El pago o recibo solicitado no fue encontrado.';
  return productErrorMessage(error.status ?? -1, fallback);
}
