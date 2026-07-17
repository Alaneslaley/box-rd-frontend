export interface ApiResponse<T> {
  data: T;
  message?: string;
  traceId?: string;
}
