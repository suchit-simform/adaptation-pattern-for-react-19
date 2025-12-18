import { describe, it, expect } from "vitest";
import { validateQuantity } from "./validation";

describe("validateQuantity", () => {
  it("should validate correct quantity", () => {
    const result = validateQuantity(5, 10, 10);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should reject zero quantity", () => {
    const result = validateQuantity(0, 10, 10);

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should reject negative quantity", () => {
    const result = validateQuantity(-5, 10, 10);

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should reject non-integer quantity", () => {
    const result = validateQuantity(2.5, 10, 10);

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should reject quantity exceeding max", () => {
    const result = validateQuantity(15, 20, 10);

    expect(result.valid).toBe(false);
    expect(result.error?.includes("10")).toBe(true);
  });

  it("should reject quantity exceeding stock", () => {
    const result = validateQuantity(15, 10, 20);

    expect(result.valid).toBe(false);
    expect(result.error?.includes("10")).toBe(true);
  });

  it("should reject when both constraints violated", () => {
    const result = validateQuantity(15, 5, 10);

    expect(result.valid).toBe(false);
  });

  it("should use default max quantity of 10", () => {
    const result = validateQuantity(11, 20);

    expect(result.valid).toBe(false);
    expect(result.error?.includes("10")).toBe(true);
  });
});
