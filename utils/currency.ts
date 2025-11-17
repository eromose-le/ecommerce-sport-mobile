/**
 * Formats a number to a currency string.
 * @param amount - The number to format (can be integer or float).
 * @param currencySymbol - The currency symbol to prepend, default is "₦".
 * @returns A formatted currency string (e.g., ₦72,902,040.00) or "Invalid Amount" if input is not a number.
 */
export function formatCurrency(
  amount: number | string,
  currencySymbol: string = "₦"
): string {
  const parsedAmount = typeof amount === "number" ? amount : parseFloat(amount);

  if (isNaN(parsedAmount)) {
    return "Invalid Amount"; // Or return a fallback like "₦0.00".
  }

  return `${currencySymbol}${parsedAmount
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
