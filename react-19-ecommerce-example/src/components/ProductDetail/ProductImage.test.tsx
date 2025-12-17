import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductImage } from "./ProductImage";
import type { ProductImage as ProductImageType } from "../../types/product";

const mockImages: ProductImageType[] = [
  {
    id: "main-1",
    url: "/products/product-1.svg",
    alt: "Main image",
    isThumbnail: false,
  },
  {
    id: "thumb-1",
    url: "/products/product-1-thumb.svg",
    alt: "Thumbnail 1",
    isThumbnail: true,
  },
  {
    id: "thumb-2",
    url: "/products/product-2.svg",
    alt: "Thumbnail 2",
    isThumbnail: true,
  },
];

describe("ProductImage", () => {
  it("should render product images section", () => {
    render(<ProductImage images={mockImages} productName="Test Product" />);
    const imgs = screen.getAllByRole("img");
    expect(imgs.length).toBeGreaterThan(0);
  });

  it("should render thumbnails", () => {
    render(<ProductImage images={mockImages} productName="Test Product" />);
    const thumbnails = screen.getAllByRole("button");
    // Should have thumbnail buttons
    expect(thumbnails.length).toBeGreaterThan(0);
  });

  it("should select thumbnail on click", async () => {
    render(<ProductImage images={mockImages} productName="Test Product" />);
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 1) {
      await userEvent.click(buttons[1]);
      expect(buttons[1]).toHaveClass("product-image__thumbnail--active");
    }
  });

  it("should navigate thumbnails with arrow keys", async () => {
    render(<ProductImage images={mockImages} productName="Test Product" />);
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 1) {
      buttons[0].focus();
      fireEvent.keyDown(buttons[0], { key: "ArrowRight" });
      // Check that second button is now active
      expect(buttons[1]).toHaveClass("product-image__thumbnail--active");
    }
  });

  it("should have aria labels", () => {
    render(<ProductImage images={mockImages} productName="Test Product" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("aria-label");
  });
});
