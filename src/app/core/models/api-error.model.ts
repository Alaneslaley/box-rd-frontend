export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
  timestamp?: string;
  traceId?: string;
  status?: number;
}
