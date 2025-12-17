import { useEffect } from "react";
import type { Product } from "../../types/product";
import { useAsync } from "../../hooks/useAsync";
import { getProduct } from "../../api/productApi";
import { StockIndicator } from "./StockIndicator";
import { ProductImage } from "./ProductImage";
import { ProductInfo } from "./ProductInfo";
import { AddToCartButton } from "./AddToCartButton";
import "./ProductDetail.css";

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { data: product, error, isLoading, execute } = useAsync<Product>(null);

  useEffect(() => {
    execute(async () => {
      const response = await getProduct(productId);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Failed to load product");
      }
      return response.data;
    });
  }, [productId, execute]);

  if (isLoading) {
    return (
      <div className="product-detail product-detail--loading">
        <div className="product-detail__skeleton-image" />
        <div className="product-detail__skeleton-info">
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line skeleton-line--text" />
          <div className="skeleton-line skeleton-line--text" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail product-detail--error" role="alert">
        <div className="product-detail__error-content">
          <h2 className="product-detail__error-title">Product Not Found</h2>
          <p className="product-detail__error-message">
            {error?.message || "Unable to load the requested product"}
          </p>
        </div>
      </div>
    );
  }

  const thumbnailImages = product.images.filter((img) => img.isThumbnail);
  const mainImages = product.images.filter((img) => !img.isThumbnail);

  return (
    <div className="product-detail">
      <div className="product-detail__image-section">
        {mainImages.length > 0 || thumbnailImages.length > 0 ? (
          <ProductImage images={product.images} productName={product.name} />
        ) : (
          <div className="product-detail__no-image">No images available</div>
        )}
      </div>

      <div className="product-detail__info-section">
        <ProductInfo product={product} />

        <div className="product-detail__meta">
          <div className="product-detail__stock">
            <StockIndicator stock={product.stock} />
          </div>

          <div className="product-detail__actions">
            <AddToCartButton
              productId={product.id}
              stock={product.stock}
              price={product.price}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
