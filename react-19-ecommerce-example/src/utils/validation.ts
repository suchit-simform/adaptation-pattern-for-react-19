export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate quantity against stock and max order size
 */
export function validateQuantity(
  quantity: number,
  stock: number,
  maxQuantity: number = 10
): ValidationResult {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      valid: false,
      error: "Quantity must be a positive integer",
    };
  }

  if (quantity > maxQuantity) {
    return {
      valid: false,
      error: `Quantity cannot exceed ${maxQuantity}`,
    };
  }

  if (quantity > stock) {
    return {
      valid: false,
      error: `Only ${stock} items available in stock`,
    };
  }

  return { valid: true };
}
