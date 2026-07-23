import { PageResponse } from './page-response.model';

export const MAX_PAGE_SIZE = 100;

export interface PageRequest {
  page: number;
  size: number;
}

export function normalizePageRequest(request: PageRequest): PageRequest {
  const page = Number.isFinite(request.page) ? Math.floor(request.page) : 0;
  const size = Number.isFinite(request.size) ? Math.floor(request.size) : 20;
  return {
    page: Math.max(0, page),
    size: Math.min(MAX_PAGE_SIZE, Math.max(1, size)),
  };
}

export function normalizePageResponse<T>(
  response: Partial<PageResponse<T>> | null | undefined,
  requested: PageRequest,
): PageResponse<T> {
  const fallback = normalizePageRequest(requested);
  const page = Math.max(0, integerOr(response?.page, fallback.page));
  const size = Math.min(MAX_PAGE_SIZE, Math.max(1, integerOr(response?.size, fallback.size)));
  const totalElements = Math.max(0, integerOr(response?.totalElements, 0));
  const totalPages = Math.max(0, integerOr(response?.totalPages, 0));

  return {
    content: Array.isArray(response?.content) ? response.content : [],
    page,
    size,
    totalElements,
    totalPages,
    first: typeof response?.first === 'boolean' ? response.first : page === 0,
    last: typeof response?.last === 'boolean' ? response.last : totalPages === 0 || page >= totalPages - 1,
  };
}

function integerOr(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.floor(value) : fallback;
}
