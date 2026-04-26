export function formatLineDiscount(value: number) {
  if (value === 0) return "—";
  if (value > 0 && value <= 1) {
    return `${(value * 100).toFixed(1).replace(/\.0$/, "")}%`;
  }
  return `${value}%`;
}
