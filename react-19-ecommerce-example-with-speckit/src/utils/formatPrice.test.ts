import { describe, it, expect } from "vitest";
import { formatPrice } from "./formatPrice";

describe("formatPrice", () => {
  it("should format USD price with dollar sign", () => {
    const result = formatPrice(99.99, "USD");
    expect(result).toContain("99.99");
    expect(result).toContain("$");
  });

  it("should format EUR price with euro sign", () => {
    const result = formatPrice(99.99, "EUR");
    expect(result).toContain("99");
    expect(result).toContain("€");
  });

  it("should format GBP price with pound sign", () => {
    const result = formatPrice(99.99, "GBP");
    expect(result).toContain("99.99");
    expect(result).toContain("£");
  });

  it("should default to USD", () => {
    const result = formatPrice(50);
    expect(result).toContain("$");
  });

  it("should handle large prices", () => {
    const result = formatPrice(1234567.89, "USD");
    expect(result).toContain("1,234,567.89");
  });

  it("should handle small prices", () => {
    const result = formatPrice(0.99, "USD");
    expect(result).toContain("0.99");
  });
});
