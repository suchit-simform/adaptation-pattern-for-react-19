import { useState } from "react";
import type { ProductImage as ProductImageType } from "../../types/product";
import "./ProductImage.css";

export interface ProductImageProps {
  images: ProductImageType[];
  productName: string;
}

export function ProductImage({ images, productName }: ProductImageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const mainImage = images.find((img) => !img.isThumbnail) || images[0];
  const thumbnails = images.filter((img) => img.isThumbnail);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsLoading(true);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (e.key === "ArrowLeft" && index > 0) {
      handleThumbnailClick(index - 1);
    } else if (e.key === "ArrowRight" && index < thumbnails.length - 1) {
      handleThumbnailClick(index + 1);
    }
  };

  const selectedImage = thumbnails[selectedIndex] || mainImage;

  return (
    <div className="product-image">
      <div className="product-image__main">
        {isLoading && <div className="product-image__skeleton" />}
        <img
          src={selectedImage.url}
          alt={selectedImage.alt}
          className="product-image__img"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {thumbnails.length > 0 && (
        <div className="product-image__thumbnails">
          {thumbnails.map((thumb, index) => (
            <button
              key={thumb.id}
              className={`product-image__thumbnail ${
                index === selectedIndex
                  ? "product-image__thumbnail--active"
                  : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`View ${productName} image ${index + 1}`}
              aria-pressed={index === selectedIndex}
            >
              <img src={thumb.url} alt={thumb.alt} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
