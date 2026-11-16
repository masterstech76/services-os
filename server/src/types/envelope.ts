export interface ApiResponseMeta {
  timestamp: string;
  requestId: string;
  pagination?: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; issue: string }>;
  } | null;
  meta: ApiResponseMeta;
}

export function successResponse<T>(
  data: T,
  requestId: string,
  pagination?: ApiResponseMeta['pagination']
): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      pagination
    }
  };
}

export function errorResponse(
  code: string,
  message: string,
  requestId: string,
  details?: Array<{ field?: string; issue: string }>
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
      details
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId
    }
  };
}
