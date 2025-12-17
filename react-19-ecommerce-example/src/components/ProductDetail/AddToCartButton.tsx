import { useState } from "react";
import { addToCartApi } from "../../api/cartApi";
import { validateQuantity } from "../../utils/validation";
import { useCart } from "../../context/CartContext";
import { useOptimisticUpdate } from "../../hooks/useOptimisticUpdate";
import "./AddToCartButton.css";

export interface AddToCartButtonProps {
  productId: string;
  stock: number;
  price: number;
}

export function AddToCartButton({
  productId,
  stock,
  price,
}: AddToCartButtonProps) {
  const { syncWithServer } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const stockOptimistic = useOptimisticUpdate(stock);

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate quantity
    const validation = validateQuantity(quantity, stock);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid quantity");
      return;
    }

    setIsSubmitting(true);

    try {
      // Optimistic update
      stockOptimistic.startOptimisticUpdate(stock - quantity);

      const response = await addToCartApi({ productId, quantity });

      if (response.success) {
        stockOptimistic.confirmUpdate();
        await syncWithServer();
        setSuccessMessage(`Added ${quantity} to cart!`);
        setQuantity(1);

        // Auto-dismiss success message
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        stockOptimistic.revertUpdate();
        setErrorMessage(response.error?.message || "Failed to add to cart");
      }
    } catch (error) {
      stockOptimistic.revertUpdate();
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = stock === 0 || isSubmitting;

  return (
    <div className="add-to-cart">
      <form onSubmit={handleAddToCart} className="add-to-cart__form">
        <div className="add-to-cart__quantity">
          <label htmlFor="quantity" className="add-to-cart__label">
            Quantity:
          </label>
          <div className="add-to-cart__input-group">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isDisabled}
              className="add-to-cart__button-adjust"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="add-to-cart__input"
              disabled={isDisabled}
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              disabled={quantity >= 10 || isDisabled}
              className="add-to-cart__button-adjust"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="add-to-cart__button"
          disabled={isDisabled}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="add-to-cart__spinner" />
              Adding...
            </>
          ) : (
            `Add to Cart - ${(price * quantity).toFixed(2)} USD`
          )}
        </button>
      </form>

      {errorMessage && (
        <div
          className="add-to-cart__message add-to-cart__message--error"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          className="add-to-cart__message add-to-cart__message--success"
          role="status"
        >
          {successMessage}
        </div>
      )}
    </div>
  );
}
