type Currency = "USD" | "EUR" | "GBP";

const currencyFormats: Record<Currency, { symbol: string; locale: string }> = {
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
};

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: Currency = "USD"): string {
  const format = currencyFormats[currency];

  return new Intl.NumberFormat(format.locale, {
    style: "currency",
    currency: currency,
  }).format(price);
}
