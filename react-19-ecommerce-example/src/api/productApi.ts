import type { Product } from "../types/product";
import type { ApiResponse } from "../types/api";
import { ErrorCode } from "../types/api";
import productsData from "../data/products.json";
import { db, mockApi } from "./mockApi";

// Initialize inventory on module load
db.initializeInventory(
  (productsData as Product[]).map((p) => ({
    id: p.id,
    stock: p.stock,
  }))
);

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  return mockApi.request(() => {
    const product = (productsData as Product[]).find((p) => p.id === id);

    if (!product) {
      return {
        success: false,
        error: {
          code: ErrorCode.PRODUCT_NOT_FOUND,
          message: `Product with ID ${id} not found`,
        },
      };
    }

    // Enrich product with current stock from inventory
    const stock = db.getStock(product.id);
    return {
      success: true,
      data: { ...product, stock },
    };
  });
}

/**
 * Fetch all products
 */
export async function getAllProducts(): Promise<ApiResponse<Product[]>> {
  return mockApi.request(() => {
    const products = (productsData as Product[]).map((p) => ({
      ...p,
      stock: db.getStock(p.id),
    }));

    return {
      success: true,
      data: products,
    };
  });
}
