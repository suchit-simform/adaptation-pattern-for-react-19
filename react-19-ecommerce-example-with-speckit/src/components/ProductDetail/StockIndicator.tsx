import "./StockIndicator.css";

export interface StockIndicatorProps {
  stock: number;
  threshold?: number;
}

export function StockIndicator({ stock, threshold = 5 }: StockIndicatorProps) {
  const getStatus = () => {
    if (stock === 0) return "out-of-stock";
    if (stock < threshold / 2) return "critical";
    if (stock < threshold) return "low";
    return "in-stock";
  };

  const status = getStatus();
  const statusText = {
    "out-of-stock": "Out of Stock",
    critical: `Only ${stock} left!`,
    low: `${stock} available`,
    "in-stock": `${stock} in stock`,
  }[status];

  return (
    <div className={`stock-indicator stock-indicator--${status}`} role="status">
      <span className="stock-indicator__icon">
        {status === "out-of-stock" && "✕"}
        {status === "critical" && "!"}
        {status === "low" && "⚠"}
        {status === "in-stock" && "✓"}
      </span>
      <span className="stock-indicator__text">{statusText}</span>
    </div>
  );
}
