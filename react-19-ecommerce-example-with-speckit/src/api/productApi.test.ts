import { describe, it, expect, beforeEach } from "vitest";
import { getProduct, getAllProducts } from "./productApi";
import { db } from "./mockApi";
import { ErrorCode } from "../types/api";

describe("Product API", () => {
  beforeEach(() => {
    db.reset();
    db.initializeInventory([
      { id: "product-1", stock: 10 },
      { id: "product-2", stock: 5 },
    ]);
  });

  describe("getProduct", () => {
    it("should return product with correct stock", async () => {
      const response = await getProduct("product-1");

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.id).toBe("product-1");
      expect(response.data?.stock).toBe(10);
    });

    it("should return product not found error", async () => {
      const response = await getProduct("non-existent");

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe(ErrorCode.PRODUCT_NOT_FOUND);
    });

    it("should update stock after inventory changes", async () => {
      db.decrementStock("product-1", 3, 0);

      const response = await getProduct("product-1");
      expect(response.data?.stock).toBe(7);
    });

    it("should include product details", async () => {
      const response = await getProduct("product-1");

      expect(response.data?.name).toBeDefined();
      expect(response.data?.price).toBeDefined();
      expect(response.data?.description).toBeDefined();
      expect(response.data?.images).toBeDefined();
    });
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      const response = await getAllProducts();

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
    });

    it("should include correct stock for each product", async () => {
      const response = await getAllProducts();

      expect(response.data?.[0].stock).toBe(10);
      expect(response.data?.[1].stock).toBe(5);
    });

    it("should update all product stocks", async () => {
      db.decrementStock("product-1", 2, 0);
      db.decrementStock("product-2", 1, 0);

      const response = await getAllProducts();
      expect(response.data?.[0].stock).toBe(8);
      expect(response.data?.[1].stock).toBe(4);
    });
  });
});
