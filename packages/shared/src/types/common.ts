// Common type definitions
// Các types chung dùng cho nhiều module

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Timestamp fields
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// ID field
export interface WithId {
  id: string;
}

// Soft delete
export interface SoftDelete {
  deletedAt: Date | null;
}
