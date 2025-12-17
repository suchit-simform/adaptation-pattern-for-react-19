import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StockIndicator } from "./StockIndicator";

describe("StockIndicator", () => {
  it("should display in-stock status", () => {
    render(<StockIndicator stock={15} />);
    expect(screen.getByText("15 in stock")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("stock-indicator--in-stock");
  });

  it("should display low stock status", () => {
    render(<StockIndicator stock={6} threshold={10} />);
    expect(screen.getByText("6 available")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("stock-indicator--low");
  });

  it("should display critical stock status", () => {
    render(<StockIndicator stock={1} threshold={10} />);
    expect(screen.getByText("Only 1 left!")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("stock-indicator--critical");
  });

  it("should display out of stock status", () => {
    render(<StockIndicator stock={0} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass(
      "stock-indicator--out-of-stock"
    );
  });

  it("should use default threshold of 5", () => {
    render(<StockIndicator stock={2} />);
    expect(screen.getByRole("status")).toHaveClass("stock-indicator--critical");
  });

  it("should use custom threshold", () => {
    render(<StockIndicator stock={8} threshold={10} />);
    expect(screen.getByRole("status")).toHaveClass("stock-indicator--low");
  });
});
