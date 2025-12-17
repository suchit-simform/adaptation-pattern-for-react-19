import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Cart } from "../types/cart";
import { getCart as getCartApi } from "../api/cartApi";

export interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  totalAmount: number;
  updateCart: (cart: Cart) => void;
  syncWithServer: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate computed values
  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const totalAmount =
    cart?.items.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;

  const updateCart = useCallback((newCart: Cart) => {
    setCart(newCart);
  }, []);

  const syncWithServer = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCartApi();

      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

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

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
