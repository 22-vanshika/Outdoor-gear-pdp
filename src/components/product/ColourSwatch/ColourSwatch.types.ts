import type { Colour } from '@/types';

export interface ColourSwatchProps {
  colours: Colour[];
  activeColourId: string;
  onSelect: (colourId: string) => void;
}
