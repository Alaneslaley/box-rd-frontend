import { normalizePageRequest, normalizePageResponse } from './page-response.util';

describe('page response utilities', () => {
  it('evita páginas negativas y limita el tamaño máximo', () => {
    expect(normalizePageRequest({ page: -4, size: 500 })).toEqual({ page: 0, size: 100 });
    expect(normalizePageRequest({ page: 2.9, size: 0 })).toEqual({ page: 2, size: 1 });
  });

  it('tolera contenido y metadatos ausentes', () => {
    expect(normalizePageResponse(null, { page: 0, size: 20 })).toEqual({
      content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true,
    });
  });
});
