export const accumulateAmounts = (
  amounts: (number | null | undefined)[]
): number => {
  return amounts.reduce<number>((sum, value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return sum;
    return sum + value;
  }, 0);
};
