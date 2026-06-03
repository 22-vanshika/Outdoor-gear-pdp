import type { EnrichedProduct } from '@/types';

export interface ProductInfoProps {
  product: EnrichedProduct;
  activeColourId?: string;
  onColourChange?: (colourId: string) => void;
}
