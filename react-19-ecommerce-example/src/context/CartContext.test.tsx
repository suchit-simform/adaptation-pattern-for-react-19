import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { CartProvider, useCart } from "./CartContext";
import { db } from "../api/mockApi";

describe("CartContext", () => {
  beforeEach(() => {
    db.reset();
    db.initializeInventory([
      { id: "product-1", stock: 10 },
      { id: "product-2", stock: 5 },
    ]);
  });

  describe("useCart hook", () => {
    it("should throw when used outside provider", () => {
      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart must be used within a CartProvider");
    });

    it("should provide cart context", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(CartProvider, { children });

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.cart).toBeDefined();
      });
    });

    it("should have initial empty cart", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(CartProvider, { children });

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.itemCount).toBe(0);
        expect(result.current.totalAmount).toBe(0);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should calculate itemCount correctly", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(CartProvider, { children });

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.itemCount).toBe(0);
      });

      // Add item to cart via database
      act(() => {
        db.addToCart({
          productId: "product-1",
          quantity: 3,
          price: 299.99,
        });
      });

      // Sync with server
      await act(async () => {
        await result.current.syncWithServer();
      });

      await waitFor(() => {
        expect(result.current.itemCount).toBe(3);
      });
    });

    it("should calculate totalAmount correctly", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(CartProvider, { children });

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.totalAmount).toBe(0);
      });

      // Add items
      act(() => {
        db.addToCart({
          productId: "product-1",
          quantity: 2,
          price: 299.99,
        });
        db.addToCart({
          productId: "product-2",
          quantity: 1,
          price: 149.99,
        });
      });

      // Sync
      await act(async () => {
        await result.current.syncWithServer();
      });

      await waitFor(() => {
        const expected = 2 * 299.99 + 149.99;
        expect(result.current.totalAmount).toBeCloseTo(expected, 2);
      });
    });

    it("should update cart", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(CartProvider, { children });

      const { result } = renderHook(() => useCart(), { wrapper });

      const newCart = {
        id: "test-cart",
        items: [
          {
            productId: "product-1",
            quantity: 5,
            price: 299.99,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await act(async () => {
        result.current.updateCart(newCart);
      });

      expect(result.current.cart).toEqual(newCart);
      expect(result.current.itemCount).toBe(5);
    });
  });
});
