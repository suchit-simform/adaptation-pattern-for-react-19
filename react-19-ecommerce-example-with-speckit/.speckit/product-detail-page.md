# Product Detail Page Specification

**Version**: 1.0  
**Created**: December 17, 2025  
**Status**: Draft

---

## 1. Overview

### 1.1 Purpose

Build a production-ready product detail page (PDP) for an ecommerce application demonstrating React 18 best practices including hooks-based state management, optimistic UI updates, async data fetching, and proper error handling with Error Boundaries.

### 1.2 Success Criteria

- ✅ Product information displays correctly with proper loading states
- ✅ Add to Cart updates server inventory and cart state
- ✅ Real-time stock validation prevents over-ordering
- ✅ Optimistic UI updates provide instant feedback
- ✅ Error states are handled gracefully with recovery options
- ✅ Performance meets Core Web Vitals targets (LCP < 2.5s)
- ✅ Accessible (WCAG AA compliant)

---

## 2. Technical Architecture

### 2.1 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Backend**: Mock API server (json-server or MSW)
- **State Management**: React Context + hooks (`useState`, `useReducer`, `useCallback`)
- **Data Fetching**: React Query (TanStack Query) or SWR
- **Styling**: CSS Modules or Tailwind CSS
- **Testing**: Vitest + React Testing Library

### 2.2 Component Structure

```
src/
├── components/
│   ├── ProductDetail/
│   │   ├── ProductDetail.tsx          # Main container component
│   │   ├── ProductDetail.module.css
│   │   ├── ProductDetail.test.tsx
│   │   ├── ProductImage.tsx           # Product image gallery
│   │   ├── ProductInfo.tsx            # Name, price, description
│   │   ├── StockIndicator.tsx         # Stock availability display
│   │   ├── AddToCartButton.tsx        # Action button component
│   │   └── index.ts
│   ├── Cart/
│   │   ├── CartSummary.tsx            # Cart count/total display
│   │   ├── CartSummary.module.css
│   │   └── index.ts
│   └── ErrorBoundary/
│       ├── ErrorBoundary.tsx          # Error boundary wrapper
│       └── index.ts
├── hooks/
│   ├── useProduct.ts                  # Product data fetching
│   ├── useCart.ts                     # Cart state management
│   ├── useInventory.ts                # Real-time inventory checks
│   └── useOptimisticUpdate.ts         # Custom optimistic update hook
├── api/
│   ├── cartApi.ts                     # Cart API client
│   └── productApi.ts                  # Product API client
├── context/
│   └── CartContext.tsx                # Global cart context
├── types/
│   ├── product.ts                     # Product type definitions
│   ├── cart.ts                        # Cart type definitions
│   └── api.ts                         # API response types
└── utils/
    ├── formatPrice.ts                 # Price formatting utility
    └── stockValidation.ts             # Stock validation logic
```

### 2.3 Data Flow

```
User Action (Add to Cart)
    ↓
OnClick handler triggered
    ↓
Optimistically update local state (custom hook)
    ↓
API call to server (async)
    ↓
Server validates inventory & updates cart
    ↓
Success: Confirm optimistic update, sync server state
Failure: Revert optimistic update + show error
    ↓
Update cart context & UI
```

---

## 3. Feature Specifications

### 3.1 Product Information Display

#### 3.1.1 Data Model

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "USD" | "EUR" | "GBP";
  images: ProductImage[];
  stock: number;
  maxQuantity: number; // Max per order
  sku: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}
```

#### 3.1.2 Display Requirements

- **Product Name**: H1 heading, max 2 lines with ellipsis
- **Price**: Large, prominent, formatted with currency symbol
- **Description**: Max 500 characters, expandable "Read more"
- **Images**: Primary image with thumbnail gallery, lazy-loaded
- **SKU**: Display below product name in smaller text
- **Rating**: Star display with review count (if available)

#### 3.1.3 Loading State

```typescript
<Suspense fallback={<ProductSkeleton />}>
  <ProductDetail productId={id} />
</Suspense>
```

- Show skeleton screens for all content sections
- Skeleton should match final layout dimensions
- Loading duration should not exceed 2 seconds

#### 3.1.4 Error State

- Display user-friendly error message if product not found
- Provide "Back to Shop" or "Try Again" action
- Log error details for debugging

---

### 3.2 Add to Cart Functionality

#### 3.2.1 Cart Data Model

```typescript
interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
  price: number; // Price at time of adding
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

interface AddToCartResponse {
  success: boolean;
  cart?: Cart;
  error?: {
    code: "OUT_OF_STOCK" | "INVALID_QUANTITY" | "SERVER_ERROR";
    message: string;
    availableStock?: number;
  };
}
```

#### 3.2.2 API Client Implementation

```typescript
// api/cartApi.ts
import { Cart, CartItem } from "@/types/cart";
import { ApiResponse } from "@/types/api";

interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export async function addToCartApi(
  request: AddToCartRequest
): Promise<ApiResponse<Cart>> {
  try {
    // 1. Validate input
    if (!request.productId || request.quantity < 1) {
      return {
        success: false,
        error: {
          code: "INVALID_QUANTITY",
          message: "Invalid quantity specified",
        },
      };
    }

    // 2. Make API call to server
    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data.cart,
      message: "Item added to cart",
    };
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to add item to cart. Please try again.",
      },
    };
  }
}

// Server endpoint (Express/Node.js example)
// POST /api/cart/add
export async function handleAddToCart(req, res) {
  const { productId, quantity } = req.body;

  try {
    // 1. Check inventory atomically
    const inventory = await checkInventory(productId);
    if (inventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: {
          code: "OUT_OF_STOCK",
          message: "Insufficient stock available",
          availableStock: inventory.stock,
        },
      });
    }

    // 2. Update cart and decrement inventory (transaction)
    const result = await db.transaction(async (tx) => {
      await tx.inventory.decrement(productId, quantity);
      const cart = await tx.cart.addItem({
        productId,
        quantity,
        price: inventory.price,
      });
      return cart;
    });

    return res.json({
      success: true,
      cart: result,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Internal server error",
      },
    });
  }
}
```

#### 3.2.3 Client Component Implementation

```typescript
// components/ProductDetail/AddToCartButton.tsx
import { useState, useCallback } from "react";
import { addToCartApi } from "@/api/cartApi";
import { useCart } from "@/context/CartContext";
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdate";

interface AddToCartButtonProps {
  product: Product;
  onSuccess?: (cart: Cart) => void;
}

export function AddToCartButton({ product, onSuccess }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { updateCart } = useCart();

  // Custom hook for optimistic updates
  const {
    optimisticValue: optimisticStock,
    startOptimisticUpdate,
    confirmUpdate,
    revertUpdate,
  } = useOptimisticUpdate(product.stock);

  const handleAddToCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Optimistically update stock
    startOptimisticUpdate(product.stock - quantity);

    try {
      const result = await addToCartApi({
        productId: product.id,
        quantity,
      });

      if (result.success && result.data) {
        // Confirm optimistic update
        confirmUpdate();

        // Update cart context
        updateCart(result.data);

        // Show success message
        setSuccessMessage(result.message || "Item added to cart");

        // Call success callback
        onSuccess?.(result.data);

        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        // Revert optimistic update on error
        revertUpdate();

        setError(result.error?.message || "Failed to add to cart");

        // Show available stock if provided
        if (result.error?.availableStock !== undefined) {
          setError(
            `${result.error.message} Only ${result.error.availableStock} left in stock.`
          );
        }
      }
    } catch (err) {
      // Revert optimistic update on exception
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
    onSuccess,
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
        <div role="alert" className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div role="status" className="success-message">
          ✓ {successMessage}
        </div>
      )}
    </div>
  );
}
```

#### 3.2.4 Validation Rules

- **Quantity**: Must be integer >= 1 and <= min(stock, maxQuantity)
- **Stock Check**: Performed atomically on server before commit
- **Concurrent Requests**: Use database transactions to prevent race conditions
- **Rate Limiting**: Max 10 add-to-cart requests per minute per user

---

### 3.3 Inventory Tracking

#### 3.3.1 Real-time Stock Display

```typescript
// components/ProductDetail/StockIndicator.tsx
interface StockIndicatorProps {
  stock: number;
  threshold?: {
    low: number; // Show "Only X left"
    critical: number; // Show warning color
  };
}

export function StockIndicator({
  stock,
  threshold = { low: 10, critical: 5 },
}: StockIndicatorProps) {
  if (stock === 0) {
    return (
      <div className="stock-indicator out-of-stock" role="status">
        <span className="icon" aria-hidden="true">
          ⚠️
        </span>
        Out of Stock
      </div>
    );
  }

  if (stock <= threshold.critical) {
    return (
      <div className="stock-indicator critical" role="status">
        <span className="icon" aria-hidden="true">
          🔴
        </span>
        Only {stock} left - Order soon!
      </div>
    );
  }

  if (stock <= threshold.low) {
    return (
      <div className="stock-indicator low" role="status">
        <span className="icon" aria-hidden="true">
          🟡
        </span>
        Only {stock} left in stock
      </div>
    );
  }

  return (
    <div className="stock-indicator in-stock" role="status">
      <span className="icon" aria-hidden="true">
        ✅
      </span>
      In Stock
    </div>
  );
}
```

#### 3.3.2 Server-side Inventory Model

```typescript
// Server-side inventory management
interface InventoryRecord {
  productId: string;
  stock: number;
  reserved: number; // Items in active carts
  available: number; // stock - reserved
  lastUpdated: Date;
  version: number; // For optimistic locking
}

// Atomic stock check and reserve
async function checkAndReserveInventory(
  productId: string,
  quantity: number
): Promise<{ success: boolean; available?: number }> {
  const inventory = await db.inventory.findUnique({
    where: { productId },
  });

  if (!inventory || inventory.available < quantity) {
    return {
      success: false,
      available: inventory?.available ?? 0,
    };
  }

  // Optimistic locking to prevent concurrent modification
  const updated = await db.inventory.updateMany({
    where: {
      productId,
      version: inventory.version,
      available: { gte: quantity },
    },
    data: {
      reserved: { increment: quantity },
      available: { decrement: quantity },
      version: { increment: 1 },
    },
  });

  return { success: updated.count > 0 };
}
```

#### 3.3.3 Inventory Update Strategy

- **Real-time Updates**: WebSocket or polling for stock changes
- **Optimistic Locking**: Prevent race conditions with version tracking
- **Stock Reservation**: Reserve items in cart for 15 minutes
- **Cleanup Job**: Release expired reservations every 5 minutes

---

### 3.4 Cart Summary Display

#### 3.4.1 Cart Context & Provider

```typescript
// context/CartContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { Cart, CartItem } from "@/types/cart";

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCart: (cart: Cart) => void;
  clearCart: () => void;
  syncWithServer: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addItem = useCallback((item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart?.items.find(
        (i) => i.productId === item.productId
      );

      if (existingItem) {
        // Update quantity if item already exists
        return {
          ...prevCart!,
          items: prevCart!.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
          updatedAt: new Date(),
        };
      }

      // Add new item
      return {
        ...prevCart!,
        items: [...(prevCart?.items ?? []), item],
        updatedAt: new Date(),
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prevCart) => {
      if (!prevCart) return null;
      return {
        ...prevCart,
        items: prevCart.items.filter((item) => item.productId !== productId),
        updatedAt: new Date(),
      };
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prevCart) => {
      if (!prevCart) return null;
      return {
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        ),
        updatedAt: new Date(),
      };
    });
  }, []);

  const updateCart = useCallback((newCart: Cart) => {
    setCart(newCart);
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
  }, []);

  const syncWithServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const serverCart = await response.json();
        setCart(serverCart);
      }
    } catch (error) {
      console.error("Failed to sync cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: CartContextValue = {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    updateCart,
    clearCart,
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

#### 3.4.2 Cart Summary Component

```typescript
// components/Cart/CartSummary.tsx
import { useCart } from "@/context/CartContext";

export function CartSummary() {
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return <div className="cart-summary skeleton" />;
  }

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const total =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  return (
    <div className="cart-summary" role="region" aria-label="Shopping cart">
      <button
        className="cart-button"
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        🛒
        {itemCount > 0 && (
          <span className="cart-badge" aria-label={`${itemCount} items`}>
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      <div className="cart-total" aria-live="polite">
        ${total.toFixed(2)}
      </div>
    </div>
  );
}
```

#### 3.4.3 Custom Optimistic Update Hook

```typescript
// hooks/useOptimisticUpdate.ts
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
    // Keep the optimistic value as the confirmed value
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

---

### 3.5 Error Handling & Edge Cases

#### 3.5.1 Error Boundary Implementation

```typescript
// components/ErrorBoundary/ProductErrorBoundary.tsx
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ProductErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Product page error:", error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="error-container" role="alert">
            <h2>Something went wrong</h2>
            <p>We're having trouble loading this product.</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
            <a href="/shop">Back to Shop</a>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

#### 3.5.2 Edge Cases & Handling

| Edge Case               | Scenario                                    | Handling Strategy                                                             |
| ----------------------- | ------------------------------------------- | ----------------------------------------------------------------------------- |
| **Negative Stock**      | Stock goes below 0 due to bug               | Validation: Reject if stock < quantity. Recovery: Set stock to 0, alert admin |
| **Concurrent Requests** | Multiple users add last item simultaneously | Optimistic locking with version field. First commit wins, others get error    |
| **Network Failure**     | Request fails mid-transaction               | Retry logic (3 attempts). Revert optimistic update. Show retry button         |
| **Stale Cart**          | Cart data outdated (>5 min old)             | Auto-refresh cart on page focus. Validate stock before checkout               |
| **Race Condition**      | User adds item while stock updates          | Atomic transaction. Lock inventory record during update                       |
| **Invalid Quantity**    | User enters 0, negative, or non-numeric     | Client & server validation. Clamp to valid range [1, max]                     |
| **Cart Overflow**       | User tries to add 1000+ items               | Set reasonable max (e.g., 99 per item). Show warning message                  |
| **Session Timeout**     | User session expires during add             | Re-authenticate. Preserve action. Complete after login                        |
| **Price Change**        | Price changes between view and add          | Store price at add time. Show warning if price increased                      |
| **Product Deleted**     | Product removed while viewing               | Show "Product no longer available" error with redirect                        |

#### 3.5.3 Error Response Format

```typescript
interface ErrorResponse {
  code: string;
  message: string;
  field?: string; // Which field caused the error
  metadata?: {
    availableStock?: number;
    suggestedQuantity?: number;
    retryAfter?: number; // Seconds until retry allowed
  };
  timestamp: string;
  requestId: string; // For support/debugging
}
```

---

## 4. User Experience Requirements

### 4.1 Interaction Flows

#### 4.1.1 Happy Path: Add to Cart

```
1. User lands on product page
   → Show loading skeleton (< 500ms)
   → Load product data
   → Display product with stock indicator

2. User reviews product
   → Clear pricing information
   → Stock availability visible
   → Product images loaded

3. User selects quantity
   → Validate max quantity
   → Show price calculation (if multiple)

4. User clicks "Add to Cart"
   → Button shows "Adding..." state
   → Optimistic stock decrement
   → Cart badge increments immediately

5. Server confirms
   → Success message appears (3s auto-dismiss)
   → Stock indicator updates
   → Cart total updates
```

#### 4.1.2 Error Path: Out of Stock

```
1. User attempts to add out-of-stock item
   → Button disabled with "Out of Stock" label
   → Stock indicator shows "Out of Stock" in red
   → Optional: "Notify when available" button

2. If stock depletes while viewing
   → Real-time update disables button
   → Toast notification: "This item just sold out"
   → Suggest similar products
```

#### 4.1.3 Error Path: Insufficient Stock

```
1. User enters quantity > available stock
   → Quantity input clamped to max available
   → Helper text: "Only X available"

2. User submits quantity exceeding stock
   → Error message displays
   → Suggests available quantity
   → Auto-adjusts quantity to maximum available
```

### 4.2 Loading States

- **Initial Page Load**: Full skeleton (< 2s)
- **Add to Cart**: Button spinner (< 1s)
- **Stock Updates**: Subtle pulse animation
- **Image Loading**: Progressive image loading with blur-up

### 4.3 Success Feedback

- **Toast Notification**: "Added to cart" with undo option (3s)
- **Cart Badge Animation**: Bounce animation on count change
- **Visual Confirmation**: Green checkmark icon briefly

### 4.4 Accessibility Requirements

- **Keyboard Navigation**: Full keyboard support, visible focus indicators
- **Screen Readers**: Proper ARIA labels, live regions for updates
- **Color Contrast**: 4.5:1 minimum for all text
- **Error Announcements**: aria-live="polite" for non-critical, "assertive" for errors
- **Focus Management**: Focus to error message on validation failure

---

## 5. Performance Requirements

### 5.1 Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.0s (product image)
- **FID (First Input Delay)**: < 100ms (add to cart button)
- **CLS (Cumulative Layout Shift)**: < 0.1
- **INP (Interaction to Next Paint)**: < 200ms

### 5.2 Optimization Strategies

#### 5.2.1 Image Optimization

```typescript
// Use next-gen formats with fallbacks
<picture>
  <source srcset="product.avif" type="image/avif" />
  <source srcset="product.webp" type="image/webp" />
  <img
    src="product.jpg"
    alt={product.name}
    loading="lazy"
    width={600}
    height={600}
  />
</picture>
```

#### 5.2.2 Code Splitting

```typescript
// Lazy load non-critical components
const ProductReviews = lazy(() => import("./ProductReviews"));
const RelatedProducts = lazy(() => import("./RelatedProducts"));

<Suspense fallback={<ReviewsSkeleton />}>
  <ProductReviews productId={id} />
</Suspense>;
```

#### 5.2.3 Data Fetching with React Query

```typescript
// Using React Query (TanStack Query) for caching
import { useQuery } from "@tanstack/react-query";

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Or with SWR
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProduct(id: string) {
  return useSWR(`/api/products/${id}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 5.3 Bundle Size Targets

- **Initial Bundle**: < 150KB (gzipped)
- **Product Page Chunk**: < 50KB (gzipped)
- **Total Page Weight**: < 500KB (including images)

---

## 6. Testing Requirements

### 6.1 Unit Tests

#### 6.1.1 Component Tests

```typescript
// ProductDetail.test.tsx
describe("ProductDetail", () => {
  it("displays product information correctly", async () => {
    const product = mockProduct({ stock: 10 });
    render(<ProductDetail product={product} />);

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
  });

  it("disables add to cart when out of stock", () => {
    const product = mockProduct({ stock: 0 });
    render(<ProductDetail product={product} />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Out of Stock");
  });

  it("shows error when adding more than available stock", async () => {
    const product = mockProduct({ stock: 5 });
    render(<ProductDetail product={product} />);

    const input = screen.getByLabelText(/quantity/i);
    await userEvent.clear(input);
    await userEvent.type(input, "10");

    expect(screen.getByText(/only 5 available/i)).toBeInTheDocument();
  });
});
```

#### 6.1.2 API Client Tests

```typescript
// cartApi.test.ts
import { addToCartApi } from "@/api/cartApi";
import { server } from "@/test/mocks/server";
import { rest } from "msw";

describe("addToCartApi", () => {
  it("successfully adds item to cart", async () => {
    const result = await addToCartApi({
      productId: "123",
      quantity: 2,
    });

    expect(result.success).toBe(true);
    expect(result.data?.items).toHaveLength(1);
  });

  it("returns error when out of stock", async () => {
    server.use(
      rest.post("/api/cart/add", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            success: false,
            error: {
              code: "OUT_OF_STOCK",
              message: "Insufficient stock available",
              availableStock: 0,
            },
          })
        );
      })
    );

    const result = await addToCartApi({
      productId: "123",
      quantity: 1,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("OUT_OF_STOCK");
  });

  it("handles concurrent requests correctly", async () => {
    // Mock server to only allow one request to succeed
    let successCount = 0;

    server.use(
      rest.post("/api/cart/add", async (req, res, ctx) => {
        if (successCount === 0) {
          successCount++;
          return res(ctx.json({ success: true, cart: mockCart() }));
        }
        return res(
          ctx.status(400),
          ctx.json({
            success: false,
            error: { code: "OUT_OF_STOCK", message: "Item sold out" },
          })
        );
      })
    );

    const requests = Array(3)
      .fill(null)
      .map(() => addToCartApi({ productId: "123", quantity: 1 }));

    const results = await Promise.all(requests);
    const successful = results.filter((r) => r.success).length;

    expect(successful).toBe(1); // Only one should succeed
  });
});
```

### 6.2 Integration Tests

```typescript
describe("Product to Cart Flow", () => {
  it("completes full add to cart journey", async () => {
    const { user } = setup("/products/123");

    // 1. Product loads
    await screen.findByText("Test Product");

    // 2. User enters quantity
    const quantityInput = screen.getByLabelText(/quantity/i);
    await user.clear(quantityInput);
    await user.type(quantityInput, "2");

    // 3. User adds to cart
    const addButton = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addButton);

    // 4. Success feedback
    await screen.findByText(/added to cart/i);

    // 5. Cart updates
    expect(screen.getByLabelText(/shopping cart/i)).toHaveTextContent("2");
  });
});
```

### 6.3 Accessibility Tests

```typescript
import { axe } from "jest-axe";

it("has no accessibility violations", async () => {
  const { container } = render(<ProductDetail product={mockProduct()} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 6.4 Performance Tests

```typescript
import { measurePerformance } from "@/test-utils";

it("meets LCP target", async () => {
  const metrics = await measurePerformance(() => {
    render(<ProductDetail product={mockProduct()} />);
  });

  expect(metrics.lcp).toBeLessThan(2000);
});
```

---

## 7. API Contracts

### 7.1 Product API

#### GET `/api/products/:id`

**Response:**

```typescript
{
  "id": "prod_123",
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones...",
  "price": 299.99,
  "currency": "USD",
  "images": [
    {
      "id": "img_1",
      "url": "https://cdn.example.com/headphones-1.jpg",
      "alt": "Wireless headphones front view",
      "isPrimary": true
    }
  ],
  "stock": 15,
  "maxQuantity": 5,
  "sku": "WH-1000XM5",
  "category": "Electronics"
}
```

### 7.2 Cart API

#### POST `/api/cart/add`

**Request:**

```typescript
{
  "productId": "prod_123",
  "quantity": 2
}
```

**Response (Success):**

```typescript
{
  "success": true,
  "cart": {
    "id": "cart_456",
    "items": [
      {
        "productId": "prod_123",
        "quantity": 2,
        "price": 299.99,
        "addedAt": "2025-12-17T10:30:00Z"
      }
    ],
    "updatedAt": "2025-12-17T10:30:00Z"
  }
}
```

**Response (Error):**

```typescript
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Insufficient stock available",
    "metadata": {
      "availableStock": 1,
      "requestedQuantity": 2
    },
    "timestamp": "2025-12-17T10:30:00Z",
    "requestId": "req_789"
  }
}
```

### 7.3 Inventory API

#### GET `/api/inventory/:productId`

**Response:**

```typescript
{
  "productId": "prod_123",
  "stock": 15,
  "reserved": 3,
  "available": 12,
  "lastUpdated": "2025-12-17T10:25:00Z"
}
```

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] Set up project structure
- [ ] Create data models and TypeScript types
- [ ] Implement basic ProductDetail component
- [ ] Display product information (static data)
- [ ] Add basic styling

### Phase 2: API & Backend (Week 2)

- [ ] Set up mock API server (json-server or MSW)
- [ ] Implement cart API endpoints
- [ ] Implement inventory tracking on backend
- [ ] Add optimistic locking mechanism
- [ ] Handle concurrent request scenarios
- [ ] Add API response validation

### Phase 3: Client Integration (Week 3)

- [ ] Implement API client functions
- [ ] Create CartContext and provider
- [ ] Implement custom useOptimisticUpdate hook
- [ ] Integrate add to cart with optimistic updates
- [ ] Add loading and error states
- [ ] Implement cart summary component
- [ ] Add stock indicator with real-time updates

### Phase 4: Error Handling (Week 4)

- [ ] Add Error Boundary
- [ ] Implement all edge case handlers
- [ ] Add retry logic
- [ ] Implement user-friendly error messages
- [ ] Add error tracking/logging

### Phase 5: Polish & Optimization (Week 5)

- [ ] Performance optimization
- [ ] Accessibility audit and fixes
- [ ] Animation and transitions
- [ ] Mobile responsive design
- [ ] Cross-browser testing

### Phase 6: Testing (Week 6)

- [ ] Write unit tests (80%+ coverage)
- [ ] Write integration tests
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Load testing for concurrent scenarios

---

## 9. Success Metrics

### 9.1 Technical Metrics

- **Test Coverage**: ≥ 80%
- **Bundle Size**: < 150KB initial load
- **LCP**: < 2.0s (95th percentile)
- **Error Rate**: < 0.1%
- **API Response Time**: < 200ms (p95)

### 9.2 User Experience Metrics

- **Add to Cart Success Rate**: > 99%
- **Time to Add to Cart**: < 3s from page load
- **Cart Abandonment**: Monitor baseline
- **Error Recovery Rate**: > 90% (users who retry after error)

### 9.3 Business Metrics

- **Inventory Accuracy**: 100% (no over-selling)
- **Cart Conversion**: Track improvement vs baseline
- **User Satisfaction**: Monitor feedback
- **Support Tickets**: Track cart-related issues

---

## 10. Future Enhancements

### 10.1 Short-term (Next Sprint)

- Add product variant selection (size, color)
- Implement wishlist functionality
- Add "Recently Viewed" products
- Implement product image zoom

### 10.2 Medium-term (Next Quarter)

- Real-time inventory updates via WebSocket
- Social sharing for products
- Product comparison feature
- AI-powered product recommendations

### 10.3 Long-term (Next Year)

- AR product preview
- Voice-activated shopping
- Personalized pricing
- Predictive inventory management

---

## 11. Appendix

### 11.1 Related Documents

- [Constitution - Code Quality Principles](./.speckit/constitution.md)
- [React 18 Learning Notes](../learning.md)
- [API Documentation](./api-documentation.md)

### 11.2 Glossary

- **Optimistic Update**: UI update before server confirmation for better perceived performance
- **Optimistic Locking**: Concurrency control using version numbers to prevent race conditions
- **Context API**: React's built-in state management solution for sharing data across components
- **Custom Hook**: Reusable function that encapsulates stateful logic in React
- **Core Web Vitals**: Google's user experience metrics (LCP, FID/INP, CLS)
- **MSW (Mock Service Worker)**: API mocking library for testing
- **React Query**: Data fetching and caching library for React applications

### 11.3 References

- [React 18 Documentation](https://react.dev)
- [React Context API](https://react.dev/reference/react/useContext)
- [TanStack Query (React Query)](https://tanstack.com/query/latest)
- [SWR Documentation](https://swr.vercel.app)
- [MSW (Mock Service Worker)](https://mswjs.io)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)

---

**Document Status**: Ready for Implementation  
**Next Review**: After Phase 3 completion  
**Owner**: Development Team  
**Last Updated**: December 17, 2025
