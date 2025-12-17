/**
 * API response and error type definitions
 */

export const ErrorCode = {
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  INVALID_QUANTITY: "INVALID_QUANTITY",
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface AddToCartResponse {
  cartId: string;
  itemCount: number;
  totalAmount: number;
}
