import { HttpStatus } from "@nestjs/common";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ApiResponseOptions<T = unknown> = {
  success: boolean;
  message: string;
  statusCode: HttpStatus;
  data?: T | null;
  errors?: unknown;
  meta?: PaginationMeta | Record<string, unknown>;
};

export type SuccessResponse<T = unknown> = {
  success: true;
  message: string;
  statusCode: HttpStatus;
  data?: T | null;
  meta?: PaginationMeta | Record<string, unknown>;
};

export type ErrorResponse = {
  success: false;
  message: string;
  statusCode: HttpStatus;
  errors?: unknown;
};
