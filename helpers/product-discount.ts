type Product = {
  price?: number | null;
  salesPrice?: number | null;
};

export function calculatePercentageDecrease(product: Product): string | null {
  const price = product.price ?? 0;
  const salesPrice = product.salesPrice ?? 0;

  // Avoid divide by zero or invalid calc
  if (price <= 0 || salesPrice < 0) return "0%";

  const decrease = price - salesPrice;
  const percentage = (decrease / price) * 100;

  if (percentage === 100) return null;

  return `${Math.round(percentage)}% OFF`;
}

// Example usage:
const product = { price: 30000, salesPrice: 27000 };
console.log(calculatePercentageDecrease(product)); // "10%"

export function getEffectivePrice(price?: number, salesPrice?: number): number {
  if (typeof salesPrice === "number") return salesPrice;
  return price || 0;
}
