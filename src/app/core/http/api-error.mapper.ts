import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error.model';

const PRODUCT_MESSAGES: Record<number, string> = {
  0: 'No se pudo conectar con el servidor.',
  400: 'Revisa la información capturada.',
  401: 'Tu sesión no es válida o ha expirado.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'La información solicitada no está disponible.',
  409: 'La operación entra en conflicto con el estado actual.',
  422: 'Revisa la información capturada.',
  429: 'Hay demasiadas solicitudes. Intenta nuevamente en unos minutos.',
  500: 'El servicio no está disponible temporalmente. Intenta nuevamente.',
  502: 'El servicio no está disponible temporalmente. Intenta nuevamente.',
  503: 'El servicio no está disponible temporalmente. Intenta nuevamente.',
  504: 'El servicio tardó demasiado en responder. Intenta nuevamente.',
};

export function productErrorMessage(status: number, fallback = 'No fue posible completar la operación. Intenta nuevamente.'): string {
  return PRODUCT_MESSAGES[status] ?? (status >= 500 ? PRODUCT_MESSAGES[503] : fallback);
}

export function mapHttpError(error: HttpErrorResponse): ApiError {
  const body = error.error && typeof error.error === 'object'
    ? error.error as Partial<ApiError>
    : null;

  return {
    code: typeof body?.code === 'string' ? body.code : `HTTP_${error.status || 'NETWORK'}`,
    message: productErrorMessage(error.status),
    // Los detalles se conservan para lógica interna, pero nunca se presentan como texto crudo.
    details: body?.details,
    timestamp: typeof body?.timestamp === 'string' ? body.timestamp : undefined,
    traceId: typeof body?.traceId === 'string' ? body.traceId : error.headers.get('X-Trace-Id') ?? undefined,
    status: error.status,
  };
}
