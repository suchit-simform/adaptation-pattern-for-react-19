/**
 * Product type definitions
 */

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isThumbnail: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  rating?: number;
  images: ProductImage[];
  stock: number;
}
