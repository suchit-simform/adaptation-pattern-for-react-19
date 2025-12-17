import type { Cart, CartItem } from "../types/cart";
import type {
  AddToCartRequest,
  ApiResponse,
  AddToCartResponse,
} from "../types/api";
import type { Product } from "../types/product";
import { ErrorCode } from "../types/api";
import productsData from "../data/products.json";
import { db, mockApi } from "./mockApi";

const MAX_QUANTITY_PER_ORDER = 10;

/**
 * Add item to cart with validation and atomic stock decrement
 */
export async function addToCartApi(
  request: AddToCartRequest
): Promise<ApiResponse<AddToCartResponse>> {
  return mockApi.request(() => {
    const { productId, quantity } = request;

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return {
        success: false,
        error: {
          code: ErrorCode.INVALID_QUANTITY,
          message: "Quantity must be a positive integer",
        },
      };
    }

    if (quantity > MAX_QUANTITY_PER_ORDER) {
      return {
        success: false,
        error: {
          code: ErrorCode.INVALID_QUANTITY,
          message: `Maximum quantity per order is ${MAX_QUANTITY_PER_ORDER}`,
        },
      };
    }

    // Check product exists
    const product = (productsData as Product[]).find((p) => p.id === productId);
    if (!product) {
      return {
        success: false,
        error: {
          code: ErrorCode.PRODUCT_NOT_FOUND,
          message: `Product with ID ${productId} not found`,
        },
      };
    }

    // Check stock availability and perform atomic decrement
    const currentStock = db.getStock(productId);
    const currentVersion = db.getVersion(productId);

    if (currentStock < quantity) {
      return {
        success: false,
        error: {
          code: ErrorCode.OUT_OF_STOCK,
          message: `Only ${currentStock} items available in stock`,
          details: { available: currentStock, requested: quantity },
        },
      };
    }

    try {
      // Atomic operation: decrement stock
      db.decrementStock(productId, quantity, currentVersion);
    } catch (error) {
      // Race condition detected
      return {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message:
            "Request failed due to concurrent modification. Please retry.",
        },
      };
    }

    // Update cart
    const cartItem: CartItem = {
      productId,
      quantity,
      price: product.price,
    };
    const updatedCart = db.addToCart(cartItem);

    // Calculate totals
    const itemCount = updatedCart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalAmount = updatedCart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    return {
      success: true,
      data: {
        cartId: updatedCart.id,
        itemCount,
        totalAmount,
      },
    };
  });
}

/**
 * Get current cart
 */
export async function getCart(): Promise<ApiResponse<Cart>> {
  return mockApi.request(() => {
    const cart = db.getCart();
    return {
      success: true,
      data: cart,
    };
  });
}
