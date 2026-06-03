import type { Size } from '@/types';

export interface SizeSelectorProps {
  sizes: Size[];
  activeSizeId: string | null;
  onSelect: (sizeId: string) => void;
}
