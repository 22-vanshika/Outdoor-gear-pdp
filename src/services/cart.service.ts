import type { CartItem } from '@/types';

export async function addToCart(_item: Partial<CartItem>): Promise<void> {
  void _item;
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  if (Math.random() < 0.2) {
    throw new Error('Failed to add item to cart. Please try again.');
  }
}
