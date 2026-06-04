import type { CartItem } from '@/types';
import { CART_SERVICE_MIN_DELAY, CART_SERVICE_DELAY_RANGE, CART_SERVICE_FAILURE_RATE } from '@/constants';

export async function addToCart(_item: Partial<CartItem>): Promise<void> {
  void _item;
  const delay = CART_SERVICE_MIN_DELAY + Math.random() * CART_SERVICE_DELAY_RANGE;
  await new Promise<void>((resolve) => setTimeout(resolve, delay));
  if (Math.random() < CART_SERVICE_FAILURE_RATE) {
    throw new Error('Failed to add item to cart. Please try again.');
  }
}
