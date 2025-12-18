import type { Cart, CartItem } from "../types/cart";

/**
 * MockApi class simulates network requests with configurable delay and failure rate
 */
export class MockApi {
  private delay: number;
  private failureRate: number;

  constructor(delay = 500, failureRate = 0) {
    this.delay = delay;
    this.failureRate = Math.min(Math.max(failureRate, 0), 1);
  }

  /**
   * Simulates a network request with delay
   */
  async request<T>(fn: () => T): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    if (Math.random() < this.failureRate) {
      throw new Error("Simulated network error");
    }

    return fn();
  }
}

/**
 * MemoryDB simulates an in-memory database with optimistic locking support
 */
export class MemoryDB {
  private inventoryMap: Map<string, { stock: number; version: number }> =
    new Map();
  private cartMap: Map<string, Cart> = new Map();
  private currentCartId = "cart-1";

  /**
   * Initialize inventory for products
   */
  initializeInventory(productData: Array<{ id: string; stock: number }>): void {
    productData.forEach(({ id, stock }) => {
      this.inventoryMap.set(id, { stock, version: 0 });
    });
  }

  /**
   * Get current stock for a product
   */
  getStock(productId: string): number {
    return this.inventoryMap.get(productId)?.stock ?? 0;
  }

  /**
   * Get version number for optimistic locking
   */
  getVersion(productId: string): number {
    return this.inventoryMap.get(productId)?.version ?? 0;
  }

  /**
   * Atomically decrement stock with optimistic locking
   * Throws if version doesn't match (race condition detected)
   */
  decrementStock(
    productId: string,
    quantity: number,
    expectedVersion: number
  ): void {
    const current = this.inventoryMap.get(productId);

    if (!current) {
      throw new Error("Product not found");
    }

    if (current.version !== expectedVersion) {
      throw new Error("Version mismatch - race condition detected");
    }

    if (current.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    current.stock -= quantity;
    current.version += 1;
  }

  /**
   * Get current cart
   */
  getCart(): Cart {
    if (!this.cartMap.has(this.currentCartId)) {
      const newCart: Cart = {
        id: this.currentCartId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.cartMap.set(this.currentCartId, newCart);
    }

    const cart = this.cartMap.get(this.currentCartId);
    return cart!;
  }

  /**
   * Update cart
   */
  setCart(cart: Cart): void {
    cart.updatedAt = new Date().toISOString();
    this.cartMap.set(this.currentCartId, cart);
  }

  /**
   * Add or update item in cart
   */
  addToCart(item: CartItem): Cart {
    const cart = this.getCart();
    const existingIndex = cart.items.findIndex(
      (i) => i.productId === item.productId
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    this.setCart(cart);
    return cart;
  }

  /**
   * Reset database (useful for testing)
   */
  reset(): void {
    this.inventoryMap.clear();
    this.cartMap.clear();
    this.currentCartId = "cart-1";
  }
}

// Singleton instances
export const db = new MemoryDB();
export const mockApi = new MockApi(500, 0);
