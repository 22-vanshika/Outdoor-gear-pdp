export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function computeOriginalPrice(salePrice: number, discountPercent: number): number {
  return parseFloat((salePrice * (1 + discountPercent / 100)).toFixed(2));
}
