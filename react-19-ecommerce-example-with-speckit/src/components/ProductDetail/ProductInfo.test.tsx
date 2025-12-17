import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductInfo } from "./ProductInfo";
import type { Product } from "../../types/product";

const mockProduct: Product = {
  id: "test-1",
  name: "Test Product",
  sku: "SKU-001",
  description: "This is a test product description",
  price: 99.99,
  rating: 4.5,
  images: [],
  stock: 10,
};

describe("ProductInfo", () => {
  it("should display product name as heading", () => {
    render(<ProductInfo product={mockProduct} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Product"
    );
  });

  it("should display SKU", () => {
    render(<ProductInfo product={mockProduct} />);
    expect(screen.getByText("SKU-001")).toBeInTheDocument();
  });

  it("should display rating", () => {
    render(<ProductInfo product={mockProduct} />);
    expect(screen.getByText(/4\.5 out of 5/)).toBeInTheDocument();
  });

  it("should display formatted price", () => {
    render(<ProductInfo product={mockProduct} />);
    expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
  });

  it("should display description", () => {
    render(<ProductInfo product={mockProduct} />);
    expect(
      screen.getByText("This is a test product description")
    ).toBeInTheDocument();
  });

  it("should not display rating if not provided", () => {
    const productWithoutRating = { ...mockProduct, rating: undefined };
    render(<ProductInfo product={productWithoutRating} />);
    expect(screen.queryByText(/out of 5/)).not.toBeInTheDocument();
  });
});
