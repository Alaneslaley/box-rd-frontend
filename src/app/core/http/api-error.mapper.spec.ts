import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { mapHttpError, productErrorMessage } from './api-error.mapper';

describe('api error mapper', () => {
  it.each([
    [0, 'No se pudo conectar con el servidor.'],
    [400, 'Revisa la información capturada.'],
    [403, 'No tienes permisos para realizar esta acción.'],
    [409, 'La operación entra en conflicto con el estado actual.'],
    [429, 'Hay demasiadas solicitudes. Intenta nuevamente en unos minutos.'],
    [503, 'El servicio no está disponible temporalmente. Intenta nuevamente.'],
  ])('mapea el estado %i a un mensaje de producto', (status, expected) => {
    expect(productErrorMessage(status)).toBe(expected);
  });

  it('no expone el mensaje técnico recibido y conserva la referencia', () => {
    const error = new HttpErrorResponse({
      status: 500,
      error: { code: 'SQL_ERROR', message: 'org.postgresql.Exception', traceId: 'trace-safe' },
      headers: new HttpHeaders(),
    });
    expect(mapHttpError(error)).toMatchObject({
      code: 'SQL_ERROR',
      message: 'El servicio no está disponible temporalmente. Intenta nuevamente.',
      traceId: 'trace-safe',
      status: 500,
    });
  });
});
