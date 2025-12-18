import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { CartProvider } from "../../context/CartContext";
import { CartSummary } from "./CartSummary";
import { db } from "../../api/mockApi";
import type { CartItem } from "../../types/cart";

describe("CartSummary", () => {
  beforeEach(() => {
    db.reset();
  });

  it("should render cart summary component", () => {
    const { container } = render(
      <CartProvider>
        <CartSummary />
      </CartProvider>
    );

    const cartSummary = container.querySelector(".cart-summary");
    expect(cartSummary).toBeInTheDocument();
  });

  it("should not show badge when cart is empty", async () => {
    render(
      <CartProvider>
        <CartSummary />
      </CartProvider>
    );

    await waitFor(() => {
      const badge = screen.queryByLabelText(/items in cart/i);
      expect(badge).not.toBeInTheDocument();
    });
  });

  it("should show badge with item count when cart has items", async () => {
    const cart = db.getCart();
    const newItem: CartItem = {
      productId: "product-1",
      quantity: 3,
      price: 299.99,
    };
    cart.items.push(newItem);
    db.setCart(cart);

    render(
      <CartProvider>
        <CartSummary />
      </CartProvider>
    );

    await waitFor(() => {
      const badge = screen.getByLabelText("3 items in cart");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("3");
    });
  });

  it("should display total amount when cart has items", async () => {
    const cart = db.getCart();
    const newItem: CartItem = {
      productId: "product-1",
      quantity: 2,
      price: 299.99,
    };
    cart.items.push(newItem);
    db.setCart(cart);

    render(
      <CartProvider>
        <CartSummary />
      </CartProvider>
    );

    await waitFor(() => {
      const total = screen.getByText("$599.98");
      expect(total).toBeInTheDocument();
    });
  });

  it("should have aria-live on total for accessibility", async () => {
    const cart = db.getCart();
    const newItem: CartItem = {
      productId: "product-1",
      quantity: 1,
      price: 299.99,
    };
    cart.items.push(newItem);
    db.setCart(cart);

    render(
      <CartProvider>
        <CartSummary />
      </CartProvider>
    );

    await waitFor(() => {
      const total = screen.getByText("$299.99");
      expect(total).toHaveAttribute("aria-live", "polite");
    });
  });

  it("should render multiple items with correct total", async () => {
    const cart = db.getCart();
    cart.items.push(
      { productId: "product-1", quantity: 2, price: 299.99 },
      { productId: "product-2", quantity: 1, price: 149.99 }
    );
    db.setCart(cart);

    render(
      <CartProvider>
        <CartSummary />
      </CartProvider>
    );

    await waitFor(() => {
      const badge = screen.getByLabelText("3 items in cart");
      expect(badge).toHaveTextContent("3");
    });

    await waitFor(() => {
      const total = screen.getByText("$749.97");
      expect(total).toBeInTheDocument();
    });
  });
});
