export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function computeOriginalPrice(salePrice: number, discountPercent: number): number {
  return parseFloat((salePrice * (1 + discountPercent / 100)).toFixed(2));
}
