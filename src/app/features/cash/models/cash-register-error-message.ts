import { ApiError } from '../../../core/models/api-error.model';

function details(error: ApiError): string {
  return error.details ? Object.values(error.details).filter(Boolean).join(' ') : '';
}

export function cashRegisterErrorMessage(error: ApiError, fallback: string): string {
  if (error.status === 0) return 'No se pudo conectar con el servidor.';
  if (error.status === 400) return details(error) || error.message || 'Revisa los datos de caja.';
  if (error.status === 403) return 'No tienes permiso para realizar esta acción.';
  if (error.status === 404) return 'No se encontró la caja solicitada.';
  if (error.status === 409) return error.message || 'La operación de caja entra en conflicto con su estado actual.';
  if (error.status && error.status >= 500) return 'El servidor no pudo procesar la solicitud. Intenta más tarde.';
  return error.message || fallback;
}
