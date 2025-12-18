# Implementation Plan - Product Detail Page

**Project**: React 18 Ecommerce Product Detail Page  
**Build Tool**: Vite  
**Approach**: Minimal dependencies, vanilla HTML/CSS/TypeScript  
**Date**: December 17, 2025

---

## 1. Project Setup

### 1.1 Dependencies

**Core Dependencies (Minimal):**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^23.0.0"
  }
}
```

**NO external libraries for:**

- ❌ UI frameworks (Material-UI, Chakra, etc.)
- ❌ State management (Redux, Zustand, etc.) - Use React Context
- ❌ Data fetching (React Query, SWR) - Use native fetch
- ❌ CSS frameworks (Tailwind, Bootstrap) - Use vanilla CSS
- ❌ Form libraries - Use native form handling
- ❌ Icon libraries - Use SVG or Unicode symbols

### 1.2 Initial Setup Commands

```bash
# Navigate to project directory
cd react-19-ecommerce-example

# Install dependencies (if needed)
pnpm install

# Verify existing setup
ls -la src/
```

---

## 2. Project Structure

### 2.1 File Organization

```
react-19-ecommerce-example/
├── public/
│   └── products/              # Static product images (no upload needed)
│       ├── product-1.jpg
│       ├── product-1-thumb.jpg
│       ├── product-2.jpg
│       └── product-2-thumb.jpg
├── src/
│   ├── components/
│   │   ├── ProductDetail/
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductDetail.css
│   │   │   ├── ProductImage.tsx
│   │   │   ├── ProductImage.css
│   │   │   ├── ProductInfo.tsx
│   │   │   ├── ProductInfo.css
│   │   │   ├── StockIndicator.tsx
│   │   │   ├── StockIndicator.css
│   │   │   ├── AddToCartButton.tsx
│   │   │   └── AddToCartButton.css
│   │   ├── Cart/
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartSummary.css
│   │   └── ErrorBoundary/
│   │       ├── ErrorBoundary.tsx
│   │       └── ErrorBoundary.css
│   ├── context/
│   │   ├── CartContext.tsx
│   │   └── ProductContext.tsx
│   ├── hooks/
│   │   ├── useOptimisticUpdate.ts
│   │   ├── useLocalStorage.ts
│   │   └── useAsync.ts
│   ├── api/
│   │   ├── mockApi.ts           # Mock server simulation
│   │   ├── productApi.ts
│   │   └── cartApi.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── formatPrice.ts
│   │   ├── storage.ts
│   │   └── validation.ts
│   ├── data/
│   │   └── products.json        # Mock product data
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Implementation Steps

### Phase 1: Core Setup & Type Definitions (Day 1)

#### Step 1.1: Create Type Definitions

**File:** `src/types/product.ts`

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "USD" | "EUR" | "GBP";
  images: ProductImage[];
  stock: number;
  maxQuantity: number;
  sku: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}
```

**File:** `src/types/cart.ts`

```typescript
export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
  price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  updatedAt: Date;
}
```

**File:** `src/types/api.ts`

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: "OUT_OF_STOCK" | "INVALID_QUANTITY" | "SERVER_ERROR" | "NOT_FOUND";
  message: string;
  availableStock?: number;
}
```

#### Step 1.2: Create Mock Product Data

**File:** `src/data/products.json`

```json
[
  {
    "id": "prod_001",
    "name": "Wireless Bluetooth Headphones",
    "description": "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    "price": 299.99,
    "currency": "USD",
    "images": [
      {
        "id": "img_001_1",
        "url": "/products/product-1.jpg",
        "alt": "Wireless headphones front view",
        "isPrimary": true
      },
      {
        "id": "img_001_2",
        "url": "/products/product-1-thumb.jpg",
        "alt": "Wireless headphones side view",
        "isPrimary": false
      }
    ],
    "stock": 15,
    "maxQuantity": 5,
    "sku": "WH-1000XM5",
    "category": "Electronics",
    "rating": 4.5,
    "reviewCount": 128
  },
  {
    "id": "prod_002",
    "name": "Smart Watch Pro",
    "description": "Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life.",
    "price": 399.99,
    "currency": "USD",
    "images": [
      {
        "id": "img_002_1",
        "url": "/products/product-2.jpg",
        "alt": "Smart watch front view",
        "isPrimary": true
      }
    ],
    "stock": 3,
    "maxQuantity": 3,
    "sku": "SW-PRO-001",
    "category": "Electronics",
    "rating": 4.8,
    "reviewCount": 89
  }
]
```

#### Step 1.3: Create Placeholder Images

**Action:** Create simple placeholder images in `public/products/`

```bash
# Create products directory
mkdir -p public/products

# Create placeholder files (to be replaced with actual images)
touch public/products/product-1.jpg
touch public/products/product-1-thumb.jpg
touch public/products/product-2.jpg
```

---

### Phase 2: Mock API Layer (Day 1-2)

#### Step 2.1: Create Mock API Utility

**File:** `src/api/mockApi.ts`

```typescript
// Simulates network delay and potential failures
export class MockApi {
  private delay: number;
  private failureRate: number;

  constructor(delay = 500, failureRate = 0) {
    this.delay = delay;
    this.failureRate = failureRate;
  }

  async request<T>(executor: () => T): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    // Simulate random failures
    if (Math.random() < this.failureRate) {
      throw new Error("Network error");
    }

    return executor();
  }
}

// In-memory database simulation
class MemoryDB {
  private inventory: Map<string, number> = new Map();
  private carts: Map<string, any> = new Map();
  private versions: Map<string, number> = new Map();

  initializeInventory(productId: string, stock: number) {
    this.inventory.set(productId, stock);
    this.versions.set(productId, 0);
  }

  getStock(productId: string): number {
    return this.inventory.get(productId) || 0;
  }

  getVersion(productId: string): number {
    return this.versions.get(productId) || 0;
  }

  // Atomic operation with optimistic locking
  decrementStock(
    productId: string,
    quantity: number,
    expectedVersion: number
  ): boolean {
    const currentVersion = this.versions.get(productId) || 0;
    const currentStock = this.inventory.get(productId) || 0;

    // Version mismatch - concurrent modification detected
    if (currentVersion !== expectedVersion) {
      return false;
    }

    // Insufficient stock
    if (currentStock < quantity) {
      return false;
    }

    // Success - update stock and version
    this.inventory.set(productId, currentStock - quantity);
    this.versions.set(productId, currentVersion + 1);
    return true;
  }

  getCart(cartId: string) {
    return this.carts.get(cartId);
  }

  setCart(cartId: string, cart: any) {
    this.carts.set(cartId, cart);
  }
}

export const db = new MemoryDB();
export const mockApi = new MockApi(500, 0.05); // 500ms delay, 5% failure rate
```

#### Step 2.2: Create Product API

**File:** `src/api/productApi.ts`

```typescript
import { Product } from "../types/product";
import { ApiResponse } from "../types/api";
import { mockApi, db } from "./mockApi";
import productsData from "../data/products.json";

// Initialize inventory on module load
productsData.forEach((product) => {
  db.initializeInventory(product.id, product.stock);
});

export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  return mockApi.request(() => {
    const product = productsData.find((p) => p.id === id);

    if (!product) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Product not found",
        },
      };
    }

    // Return product with current stock from DB
    const currentStock = db.getStock(product.id);

    return {
      success: true,
      data: {
        ...product,
        stock: currentStock,
      } as Product,
    };
  });
}

export async function getAllProducts(): Promise<ApiResponse<Product[]>> {
  return mockApi.request(() => {
    const productsWithStock = productsData.map((product) => ({
      ...product,
      stock: db.getStock(product.id),
    }));

    return {
      success: true,
      data: productsWithStock as Product[],
    };
  });
}
```

#### Step 2.3: Create Cart API

**File:** `src/api/cartApi.ts`

```typescript
import { Cart, CartItem } from "../types/cart";
import { ApiResponse } from "../types/api";
import { mockApi, db } from "./mockApi";
import productsData from "../data/products.json";

const CART_ID = "user_cart_001"; // Single user cart for demo

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export async function addToCartApi(
  request: AddToCartRequest
): Promise<ApiResponse<Cart>> {
  return mockApi.request(() => {
    const { productId, quantity } = request;

    // Validate input
    if (!productId || quantity < 1) {
      return {
        success: false,
        error: {
          code: "INVALID_QUANTITY",
          message: "Invalid quantity specified",
        },
      };
    }

    // Get product info
    const product = productsData.find((p) => p.id === productId);
    if (!product) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Product not found",
        },
      };
    }

    // Check max quantity per order
    if (quantity > product.maxQuantity) {
      return {
        success: false,
        error: {
          code: "INVALID_QUANTITY",
          message: `Maximum ${product.maxQuantity} items allowed per order`,
        },
      };
    }

    // Get current version for optimistic locking
    const version = db.getVersion(productId);
    const currentStock = db.getStock(productId);

    // Check stock availability
    if (currentStock < quantity) {
      return {
        success: false,
        error: {
          code: "OUT_OF_STOCK",
          message: "Insufficient stock available",
          availableStock: currentStock,
        },
      };
    }

    // Attempt atomic decrement
    const success = db.decrementStock(productId, quantity, version);

    if (!success) {
      // Concurrent modification detected
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Concurrent modification detected. Please try again.",
        },
      };
    }

    // Update cart
    const existingCart = db.getCart(CART_ID) || {
      id: CART_ID,
      items: [],
      updatedAt: new Date(),
    };

    const existingItemIndex = existingCart.items.findIndex(
      (item: CartItem) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      existingCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      existingCart.items.push({
        productId,
        quantity,
        price: product.price,
        addedAt: new Date(),
      });
    }

    existingCart.updatedAt = new Date();
    db.setCart(CART_ID, existingCart);

    return {
      success: true,
      data: existingCart,
      message: "Item added to cart",
    };
  });
}

export async function getCart(): Promise<ApiResponse<Cart>> {
  return mockApi.request(() => {
    const cart = db.getCart(CART_ID) || {
      id: CART_ID,
      items: [],
      updatedAt: new Date(),
    };

    return {
      success: true,
      data: cart,
    };
  });
}
```

---

### Phase 3: Utility Functions & Hooks (Day 2)

#### Step 3.1: Create Utility Functions

**File:** `src/utils/formatPrice.ts`

```typescript
export function formatPrice(
  price: number,
  currency: "USD" | "EUR" | "GBP" = "USD"
): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  return `${symbols[currency]}${price.toFixed(2)}`;
}
```

**File:** `src/utils/storage.ts`

```typescript
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
}
```

**File:** `src/utils/validation.ts`

```typescript
export function validateQuantity(
  quantity: number,
  stock: number,
  maxQuantity: number
): { valid: boolean; error?: string } {
  if (!Number.isInteger(quantity)) {
    return { valid: false, error: "Quantity must be a whole number" };
  }

  if (quantity < 1) {
    return { valid: false, error: "Quantity must be at least 1" };
  }

  if (quantity > stock) {
    return {
      valid: false,
      error: `Only ${stock} items available`,
    };
  }

  if (quantity > maxQuantity) {
    return {
      valid: false,
      error: `Maximum ${maxQuantity} items per order`,
    };
  }

  return { valid: true };
}
```

#### Step 3.2: Create Custom Hooks

**File:** `src/hooks/useOptimisticUpdate.ts`

```typescript
import { useState, useCallback, useRef } from "react";

export function useOptimisticUpdate<T>(initialValue: T) {
  const [optimisticValue, setOptimisticValue] = useState<T>(initialValue);
  const [isOptimistic, setIsOptimistic] = useState(false);
  const previousValue = useRef<T>(initialValue);

  const startOptimisticUpdate = useCallback(
    (newValue: T) => {
      previousValue.current = optimisticValue;
      setOptimisticValue(newValue);
      setIsOptimistic(true);
    },
    [optimisticValue]
  );

  const confirmUpdate = useCallback(() => {
    setIsOptimistic(false);
  }, []);

  const revertUpdate = useCallback(() => {
    setOptimisticValue(previousValue.current);
    setIsOptimistic(false);
  }, []);

  return {
    optimisticValue,
    isOptimistic,
    startOptimisticUpdate,
    confirmUpdate,
    revertUpdate,
  };
}
```

**File:** `src/hooks/useLocalStorage.ts`

```typescript
import { useState, useEffect } from "react";
import { getFromStorage, setToStorage } from "../utils/storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getFromStorage(key, initialValue);
  });

  useEffect(() => {
    setToStorage(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
```

**File:** `src/hooks/useAsync.ts`

```typescript
import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const data = await asyncFunction();
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      setState({ data: null, error: error as Error, isLoading: false });
      throw error;
    }
  }, []);

  return { ...state, execute };
}
```

---

### Phase 4: Context Providers (Day 2-3)

#### Step 4.1: Create Cart Context

**File:** `src/context/CartContext.tsx`

```typescript
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { Cart, CartItem } from "../types/cart";
import { getCart } from "../api/cartApi";

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  totalAmount: number;
  updateCart: (cart: Cart) => void;
  syncWithServer: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const syncWithServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCart();
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Failed to sync cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCart = useCallback((newCart: Cart) => {
    setCart(newCart);
  }, []);

  // Initial load
  useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalAmount =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const value: CartContextValue = {
    cart,
    isLoading,
    itemCount,
    totalAmount,
    updateCart,
    syncWithServer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
```

---

### Phase 5: Components (Day 3-5)

#### Step 5.1: Stock Indicator Component

**File:** `src/components/ProductDetail/StockIndicator.tsx`

```typescript
import "./StockIndicator.css";

interface StockIndicatorProps {
  stock: number;
  threshold?: {
    low: number;
    critical: number;
  };
}

export function StockIndicator({
  stock,
  threshold = { low: 10, critical: 5 },
}: StockIndicatorProps) {
  if (stock === 0) {
    return (
      <div className="stock-indicator out-of-stock" role="status">
        <span className="stock-icon">⚠️</span>
        <span className="stock-text">Out of Stock</span>
      </div>
    );
  }

  if (stock <= threshold.critical) {
    return (
      <div className="stock-indicator critical" role="status">
        <span className="stock-icon">🔴</span>
        <span className="stock-text">Only {stock} left - Order soon!</span>
      </div>
    );
  }

  if (stock <= threshold.low) {
    return (
      <div className="stock-indicator low" role="status">
        <span className="stock-icon">🟡</span>
        <span className="stock-text">Only {stock} left in stock</span>
      </div>
    );
  }

  return (
    <div className="stock-indicator in-stock" role="status">
      <span className="stock-icon">✅</span>
      <span className="stock-text">In Stock</span>
    </div>
  );
}
```

**File:** `src/components/ProductDetail/StockIndicator.css`

```css
.stock-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 1rem 0;
}

.stock-icon {
  font-size: 1rem;
}

.stock-indicator.in-stock {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.stock-indicator.low {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.stock-indicator.critical {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  animation: pulse 2s infinite;
}

.stock-indicator.out-of-stock {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

#### Step 5.2: Add to Cart Button Component

**File:** `src/components/ProductDetail/AddToCartButton.tsx`

```typescript
import { useState, useCallback } from "react";
import { Product } from "../../types/product";
import { addToCartApi } from "../../api/cartApi";
import { useCart } from "../../context/CartContext";
import { useOptimisticUpdate } from "../../hooks/useOptimisticUpdate";
import { validateQuantity } from "../../utils/validation";
import "./AddToCartButton.css";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { updateCart } = useCart();

  const {
    optimisticValue: optimisticStock,
    startOptimisticUpdate,
    confirmUpdate,
    revertUpdate,
  } = useOptimisticUpdate(product.stock);

  const handleAddToCart = useCallback(async () => {
    setError(null);
    setSuccessMessage(null);

    // Validate quantity
    const validation = validateQuantity(
      quantity,
      product.stock,
      product.maxQuantity
    );
    if (!validation.valid) {
      setError(validation.error || "Invalid quantity");
      return;
    }

    setIsLoading(true);
    startOptimisticUpdate(product.stock - quantity);

    try {
      const result = await addToCartApi({
        productId: product.id,
        quantity,
      });

      if (result.success && result.data) {
        confirmUpdate();
        updateCart(result.data);
        setSuccessMessage(result.message || "Item added to cart");

        // Auto-dismiss success message
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        revertUpdate();
        setError(result.error?.message || "Failed to add to cart");
      }
    } catch (err) {
      revertUpdate();
      setError("Network error. Please try again.");
      console.error("Add to cart error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    product,
    quantity,
    startOptimisticUpdate,
    confirmUpdate,
    revertUpdate,
    updateCart,
  ]);

  const isOutOfStock = optimisticStock <= 0;
  const maxQuantity = Math.min(product.stock, product.maxQuantity);

  return (
    <div className="add-to-cart-container">
      <div className="quantity-selector">
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          max={maxQuantity}
          disabled={isLoading || isOutOfStock}
          aria-label="Product quantity"
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading || isOutOfStock}
        aria-busy={isLoading}
        className="add-to-cart-button"
      >
        {isLoading
          ? "Adding..."
          : isOutOfStock
          ? "Out of Stock"
          : "Add to Cart"}
      </button>

      {error && (
        <div role="alert" className="message error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div role="status" className="message success-message">
          ✓ {successMessage}
        </div>
      )}
    </div>
  );
}
```

**File:** `src/components/ProductDetail/AddToCartButton.css`

```css
.add-to-cart-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-selector label {
  font-weight: 500;
  color: #333;
}

.quantity-selector input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
}

.quantity-selector input:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.quantity-selector input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.add-to-cart-button {
  padding: 1rem 2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.add-to-cart-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.add-to-cart-button:active:not(:disabled) {
  transform: scale(0.98);
}

.add-to-cart-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.add-to-cart-button[aria-busy="true"] {
  cursor: wait;
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Step 5.3: Product Info & Image Components

**File:** `src/components/ProductDetail/ProductInfo.tsx`

```typescript
import { Product } from "../../types/product";
import { formatPrice } from "../../utils/formatPrice";
import "./ProductInfo.css";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="product-info">
      <h1 className="product-name">{product.name}</h1>

      <div className="product-meta">
        <span className="product-sku">SKU: {product.sku}</span>
        {product.rating && (
          <div className="product-rating">
            <span className="rating-stars">
              {"⭐".repeat(Math.round(product.rating))}
            </span>
            <span className="rating-text">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
        )}
      </div>

      <div className="product-price">
        {formatPrice(product.price, product.currency)}
      </div>

      <div className="product-description">
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
}
```

**File:** `src/components/ProductDetail/ProductInfo.css`

```css
.product-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  margin: 0;
  line-height: 1.2;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.product-sku {
  font-size: 0.875rem;
  color: #6c757d;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  font-size: 1rem;
}

.rating-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.product-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #007bff;
  margin: 0.5rem 0;
}

.product-description h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
}

.product-description p {
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
}

@media (max-width: 768px) {
  .product-name {
    font-size: 1.5rem;
  }

  .product-price {
    font-size: 2rem;
  }
}
```

**File:** `src/components/ProductDetail/ProductImage.tsx`

```typescript
import { useState } from "react";
import { ProductImage as ProductImageType } from "../../types/product";
import "./ProductImage.css";

interface ProductImageProps {
  images: ProductImageType[];
  productName: string;
}

export function ProductImage({ images, productName }: ProductImageProps) {
  const [selectedImage, setSelectedImage] = useState(
    images.find((img) => img.isPrimary) || images[0]
  );
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="product-image-container">
      <div className="main-image-wrapper">
        {isLoading && <div className="image-skeleton"></div>}
        <img
          src={selectedImage.url}
          alt={selectedImage.alt}
          className={`main-image ${isLoading ? "loading" : ""}`}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />
      </div>

      {images.length > 1 && (
        <div className="thumbnail-gallery">
          {images.map((image) => (
            <button
              key={image.id}
              className={`thumbnail ${
                selectedImage.id === image.id ? "active" : ""
              }`}
              onClick={() => {
                setIsLoading(true);
                setSelectedImage(image);
              }}
              aria-label={`View ${image.alt}`}
            >
              <img src={image.url} alt={image.alt} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**File:** `src/components/ProductDetail/ProductImage.css`

```css
.product-image-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.image-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.main-image.loading {
  opacity: 0;
}

.thumbnail-gallery {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.1s;
  background: none;
  padding: 0;
}

.thumbnail:hover {
  border-color: #007bff;
}

.thumbnail:active {
  transform: scale(0.95);
}

.thumbnail.active {
  border-color: #007bff;
  box-shadow: 0 0 0 1px #007bff;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .thumbnail {
    width: 60px;
    height: 60px;
  }
}
```

#### Step 5.4: Main Product Detail Component

**File:** `src/components/ProductDetail/ProductDetail.tsx`

```typescript
import { useEffect, useState } from "react";
import { Product } from "../../types/product";
import { getProduct } from "../../api/productApi";
import { ProductImage } from "./ProductImage";
import { ProductInfo } from "./ProductInfo";
import { StockIndicator } from "./StockIndicator";
import { AddToCartButton } from "./AddToCartButton";
import "./ProductDetail.css";

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getProduct(productId);

        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError(response.error?.message || "Failed to load product");
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error("Product load error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (isLoading) {
    return <div className="product-detail-skeleton">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error || "Product not found"}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-grid">
        <div className="product-detail-images">
          <ProductImage images={product.images} productName={product.name} />
        </div>

        <div className="product-detail-content">
          <ProductInfo product={product} />
          <StockIndicator stock={product.stock} />
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
```

**File:** `src/components/ProductDetail/ProductDetail.css`

```css
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.product-detail-images {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.product-detail-content {
  display: flex;
  flex-direction: column;
}

.product-detail-skeleton {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #6c757d;
}

.product-detail-error {
  text-align: center;
  padding: 3rem 1rem;
}

.product-detail-error h2 {
  font-size: 1.5rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.product-detail-error p {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.product-detail-error button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.product-detail-error button:hover {
  background-color: #0056b3;
}

@media (max-width: 968px) {
  .product-detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-detail-images {
    position: static;
  }
}

@media (max-width: 768px) {
  .product-detail {
    padding: 1rem;
  }

  .product-detail-grid {
    gap: 1.5rem;
  }
}
```

#### Step 5.5: Cart Summary Component

**File:** `src/components/Cart/CartSummary.tsx`

```typescript
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import "./CartSummary.css";

export function CartSummary() {
  const { itemCount, totalAmount, isLoading } = useCart();

  if (isLoading) {
    return <div className="cart-summary skeleton">Loading cart...</div>;
  }

  return (
    <div className="cart-summary" role="region" aria-label="Shopping cart">
      <button
        className="cart-button"
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <span className="cart-icon">🛒</span>
        {itemCount > 0 && (
          <span className="cart-badge" aria-label={`${itemCount} items`}>
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {itemCount > 0 && (
        <div className="cart-total" aria-live="polite">
          {formatPrice(totalAmount)}
        </div>
      )}
    </div>
  );
}
```

**File:** `src/components/Cart/CartSummary.css`

```css
.cart-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.cart-button {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-icon {
  font-size: 1.5rem;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  animation: bounce 0.5s ease-out;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.cart-total {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
}

.cart-summary.skeleton {
  color: #6c757d;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .cart-summary {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem;
  }

  .cart-total {
    display: none;
  }
}
```

#### Step 5.6: Error Boundary

**File:** `src/components/ErrorBoundary/ErrorBoundary.tsx`

```typescript
import { Component, ReactNode } from "react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="error-boundary-container" role="alert">
            <h2>Something went wrong</h2>
            <p>We're having trouble loading this page.</p>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**File:** `src/components/ErrorBoundary/ErrorBoundary.css`

```css
.error-boundary-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
}

.error-boundary-container h2 {
  font-size: 1.75rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.error-boundary-container p {
  font-size: 1.125rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.error-boundary-container button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-boundary-container button:hover {
  background-color: #0056b3;
}
```

---

### Phase 6: Main App Integration (Day 5)

#### Step 6.1: Update App Component

**File:** `src/App.tsx`

```typescript
import { CartProvider } from "./context/CartContext";
import { ProductDetail } from "./components/ProductDetail/ProductDetail";
import { CartSummary } from "./components/Cart/CartSummary";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import "./App.css";

function App() {
  // For demo, using first product. In real app, get from URL params
  const productId = "prod_001";

  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="app">
          <header className="app-header">
            <h1 className="app-logo">ShopDemo</h1>
            <CartSummary />
          </header>

          <main className="app-main">
            <ProductDetail productId={productId} />
          </main>

          <footer className="app-footer">
            <p>
              &copy; 2025 ShopDemo. Built with React 18 + TypeScript + Vite.
            </p>
          </footer>
        </div>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
```

**File:** `src/App.css`

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.app-header {
  position: relative;
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007bff;
  margin: 0;
}

.app-main {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background-color: #212529;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 3rem;
}

.app-footer p {
  margin: 0;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .app-logo {
    font-size: 1.25rem;
  }

  .app-main {
    padding: 1rem 0;
  }
}
```

**File:** `src/index.css`

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

button {
  font-family: inherit;
}

input {
  font-family: inherit;
}

/* Focus visible for keyboard navigation */
:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Remove focus outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 4. Testing Strategy

### Step 7.1: Create Test Setup

**File:** `vite.config.ts` (update)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

**File:** `src/test/setup.ts`

```typescript
import "@testing-library/jest-dom";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

---

## 5. Execution Checklist

### Week 1: Foundation

- [ ] Create all type definitions
- [ ] Set up mock data (products.json)
- [ ] Create placeholder images
- [ ] Implement mock API layer
- [ ] Test mock API independently

### Week 2: Core Logic

- [ ] Implement utility functions
- [ ] Create custom hooks
- [ ] Implement CartContext
- [ ] Test hooks and context

### Week 3: UI Components

- [ ] Build StockIndicator
- [ ] Build ProductImage
- [ ] Build ProductInfo
- [ ] Build AddToCartButton
- [ ] Build CartSummary
- [ ] Test individual components

### Week 4: Integration

- [ ] Build ProductDetail container
- [ ] Implement ErrorBoundary
- [ ] Integrate with App
- [ ] End-to-end testing
- [ ] Accessibility audit

### Week 5: Polish

- [ ] Responsive design refinement
- [ ] Animation polish
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Documentation

---

## 6. Commands Reference

```bash
# Development
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Type check
pnpm run type-check
```

---

## 7. Success Criteria

✅ **Functionality:**

- Product displays with all information
- Add to cart works with optimistic updates
- Stock validation prevents overselling
- Cart summary updates in real-time
- Error handling works gracefully

✅ **Performance:**

- LCP < 2.0s
- FID < 100ms
- Bundle size < 150KB (gzipped)

✅ **Code Quality:**

- TypeScript strict mode, no errors
- All components typed
- Minimal external dependencies
- Clean, readable code

✅ **UX:**

- Responsive on all devices
- Accessible (keyboard + screen reader)
- Loading states clear
- Error messages helpful

---

**Document Status**: Ready for Implementation  
**Estimated Timeline**: 5 weeks  
**Last Updated**: December 17, 2025
