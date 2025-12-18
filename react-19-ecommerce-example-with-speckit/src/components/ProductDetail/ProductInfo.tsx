import { formatPrice } from "../../utils/formatPrice";
import type { Product } from "../../types/product";
import "./ProductInfo.css";

export interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="product-info">
      <h1 className="product-info__name">{product.name}</h1>

      <div className="product-info__sku">
        <span className="product-info__label">SKU:</span>
        <span>{product.sku}</span>
      </div>

      {product.rating !== undefined && (
        <div className="product-info__rating">
          <div className="product-info__stars">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
          </div>
          <span className="product-info__rating-value">
            {product.rating.toFixed(1)} out of 5
          </span>
        </div>
      )}

      <div className="product-info__price">
        <span className="product-info__price-label">Price:</span>
        <span className="product-info__price-value">
          {formatPrice(product.price, "USD")}
        </span>
      </div>

      <div className="product-info__description">
        <h2 className="product-info__description-heading">Description</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
}
