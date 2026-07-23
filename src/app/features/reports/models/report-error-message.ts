import { ApiError } from '../../../core/models/api-error.model';
import { productErrorMessage } from '../../../core/http/api-error.mapper';

export function reportErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 403) return 'No tienes permisos para consultar este reporte.';
  if (error.status === 404) return 'Reporte no encontrado.';
  return productErrorMessage(error.status ?? -1, fallback);
}
