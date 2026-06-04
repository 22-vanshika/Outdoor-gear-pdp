import { useCallback, useState } from 'react';
import { useCartContext } from '@/stores';
import { addToCart as addToCartService } from '@/services';
import type { CartItem, EnrichedProduct } from '@/types';
import { MAX_QUANTITY_PER_ORDER } from '@/constants';
import type { AddToCartState } from '@/components/product';

interface UseCartReturn {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  cartState: AddToCartState;
  handleAddToCart: (
    product: EnrichedProduct,
    colourId: string,
    sizeId: string,
    quantity: number
  ) => Promise<void>;
  removeItem: (productId: number, colourId: string, sizeId: string) => void;
  updateQuantity: (productId: number, colourId: string, sizeId: string, quantity: number) => void;
}

export function useCart(): UseCartReturn {
  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity } = useCartContext();
  const [cartState, setCartState] = useState<AddToCartState>('idle');

  const handleAddToCart = useCallback(
    async (
      product: EnrichedProduct,
      colourId: string,
      sizeId: string,
      quantity: number
    ): Promise<void> => {
      setCartState('loading');
      try {
        await addToCartService({ productId: product.id, colourId, sizeId, quantity });
        addItem({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0] ?? product.image,
          colourId,
          sizeId,
          quantity,
          maxQuantity: Math.min(
            product.variants.colours.find((c) => c.id === colourId)?.sizes.find((s) => s.id === sizeId)?.stock ?? 1,
            MAX_QUANTITY_PER_ORDER
          ),
        });
        setCartState('success');
      } catch {
        setCartState('error');
      } finally {
        // Reset to idle after 2s — UI concern, intentionally in the hook not the service
        setTimeout(() => setCartState('idle'), 2000);
      }
    },
    [addItem]
  );

  return {
    items,
    totalItems,
    totalPrice,
    cartState,
    handleAddToCart,
    removeItem,
    updateQuantity,
  };
}
