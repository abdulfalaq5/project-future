import { HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  PaginatedResult,
  PaginationMeta,
} from '../interfaces/api-response.interface';

// ─────────────────────────────────────────
// SUCCESS RESPONSE
// ─────────────────────────────────────────

/**
 * Build a standard success response.
 */
export function successResponse<T>(
  data: T,
  message = 'Success',
  statusCode: number = HttpStatus.OK,
  path?: string,
): ApiResponse<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
    meta: null,
    timestamp: new Date().toISOString(),
    path,
  };
}

// ─────────────────────────────────────────
// ERROR RESPONSE
// ─────────────────────────────────────────

/**
 * Build a standard error response.
 */
export function errorResponse(
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  path?: string,
): ApiResponse<null> {
  return {
    success: false,
    statusCode,
    message,
    data: null,
    meta: null,
    timestamp: new Date().toISOString(),
    path,
  };
}

// ─────────────────────────────────────────
// PAGINATED RESPONSE
// ─────────────────────────────────────────

/**
 * Build pagination meta from total, page, and limit.
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Build a paginated response.
 */
export function paginatedResponse<T>(
  result: PaginatedResult<T>,
  message = 'Data retrieved successfully',
  statusCode: number = HttpStatus.OK,
  path?: string,
): ApiResponse<T[]> {
  return {
    success: true,
    statusCode,
    message,
    data: result.data,
    meta: result.meta,
    timestamp: new Date().toISOString(),
    path,
  };
}

/**
 * Helper: combine data + total into a PaginatedResult.
 */
export function toPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    data,
    meta: buildPaginationMeta(total, page, limit),
  };
}
