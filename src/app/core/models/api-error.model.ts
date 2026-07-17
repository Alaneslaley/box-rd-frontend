export interface ApiFieldViolation {
  field?: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiFieldViolation[];
  timestamp?: string;
  traceId?: string;
  status?: number;
}
