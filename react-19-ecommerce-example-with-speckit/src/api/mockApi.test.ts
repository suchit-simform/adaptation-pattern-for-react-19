import { describe, it, expect, beforeEach } from "vitest";
import { MemoryDB, MockApi } from "./mockApi";

describe("MemoryDB", () => {
  let db: MemoryDB;

  beforeEach(() => {
    db = new MemoryDB();
  });

  describe("initializeInventory", () => {
    it("should initialize inventory correctly", () => {
      db.initializeInventory([
        { id: "product-1", stock: 10 },
        { id: "product-2", stock: 5 },
      ]);

      expect(db.getStock("product-1")).toBe(10);
      expect(db.getStock("product-2")).toBe(5);
    });
  });

  describe("getStock and getVersion", () => {
    it("should return 0 for non-existent products", () => {
      expect(db.getStock("non-existent")).toBe(0);
      expect(db.getVersion("non-existent")).toBe(0);
    });

    it("should track version correctly", () => {
      db.initializeInventory([{ id: "product-1", stock: 10 }]);
      expect(db.getVersion("product-1")).toBe(0);
    });
  });

  describe("decrementStock", () => {
    beforeEach(() => {
      db.initializeInventory([{ id: "product-1", stock: 10 }]);
    });

    it("should decrement stock correctly", () => {
      db.decrementStock("product-1", 3, 0);
      expect(db.getStock("product-1")).toBe(7);
    });

    it("should increment version after decrement", () => {
      db.decrementStock("product-1", 1, 0);
      expect(db.getVersion("product-1")).toBe(1);
    });

    it("should throw if stock insufficient", () => {
      expect(() => db.decrementStock("product-1", 15, 0)).toThrow(
        "Insufficient stock"
      );
    });

    it("should throw if version mismatch (race condition)", () => {
      expect(() => db.decrementStock("product-1", 1, 1)).toThrow(
        "Version mismatch"
      );
    });

    it("should throw if product not found", () => {
      expect(() => db.decrementStock("non-existent", 1, 0)).toThrow(
        "Product not found"
      );
    });
  });

  describe("cart operations", () => {
    it("should create empty cart on first access", () => {
      const cart = db.getCart();
      expect(cart.items).toEqual([]);
      expect(cart.id).toBeDefined();
    });

    it("should add item to cart", () => {
      db.addToCart({
        productId: "product-1",
        quantity: 2,
        price: 29.99,
      });

      const cart = db.getCart();
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe("product-1");
      expect(cart.items[0].quantity).toBe(2);
    });

    it("should update quantity when adding same product twice", () => {
      db.addToCart({ productId: "product-1", quantity: 2, price: 29.99 });
      db.addToCart({ productId: "product-1", quantity: 3, price: 29.99 });

      const cart = db.getCart();
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5);
    });

    it("should update cart timestamp", () => {
      const before = new Date(db.getCart().updatedAt).getTime();
      db.addToCart({ productId: "product-1", quantity: 1, price: 29.99 });
      const after = new Date(db.getCart().updatedAt).getTime();

      expect(after).toBeGreaterThanOrEqual(before);
    });
  });

  describe("reset", () => {
    it("should clear all data", () => {
      db.initializeInventory([{ id: "product-1", stock: 10 }]);
      db.addToCart({ productId: "product-1", quantity: 2, price: 29.99 });

      db.reset();

      expect(db.getStock("product-1")).toBe(0);
      const cart = db.getCart();
      expect(cart.items).toHaveLength(0);
    });
  });
});

describe("MockApi", () => {
  it("should execute function after delay", async () => {
    const api = new MockApi(100, 0);
    const start = Date.now();
    const result = await api.request(() => "success");
    const elapsed = Date.now() - start;

    expect(result).toBe("success");
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it("should throw on simulated failure", async () => {
    const api = new MockApi(0, 1.0); // 100% failure rate
    await expect(api.request(() => "success")).rejects.toThrow();
  });

  it("should clamp failure rate between 0 and 1", async () => {
    const api1 = new MockApi(0, -1.0);
    const api2 = new MockApi(0, 2.0);

    // api1 should clamp to 0 (no failures)
    await expect(api1.request(() => "ok")).resolves.toBe("ok");
    // api2 should clamp to 1 (always fails)
    await expect(api2.request(() => "ok")).rejects.toThrow(
      "Simulated network error"
    );
  });
});
