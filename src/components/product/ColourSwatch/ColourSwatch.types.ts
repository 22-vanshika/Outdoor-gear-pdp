import type { ColourVariant } from '@/types';

export interface ColourSwatchProps {
  colours: ColourVariant[];
  activeColourId: string;
  onSelect: (colourId: string) => void;
}
