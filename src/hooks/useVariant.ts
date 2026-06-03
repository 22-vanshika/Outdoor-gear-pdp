import { useState, useEffect } from 'react';
import type { ColourVariant, SizeStock } from '@/types';
import { getInitialColour, getInitialSize, setVariantInURL } from '@/utils';

interface UseVariantReturn {
  activeColourId: string;
  activeSizeId: string | null;
  activeSizes: SizeStock[];
  setActiveColourId: (id: string) => void;
  setActiveSizeId: (id: string | null) => void;
}

export function useVariant(colours: ColourVariant[]): UseVariantReturn {
  const [activeColourId, setActiveColourIdState] = useState<string>(
    () => getInitialColour(colours)
  );

  const activeSizes: SizeStock[] = colours.find(
    (c) => c.id === activeColourId
  )?.sizes ?? [];

  const [activeSizeId, setActiveSizeIdState] = useState<string | null>(
    () => getInitialSize(activeSizes)
  );

  function setActiveColourId(id: string): void {
    setActiveColourIdState(id);
    setActiveSizeIdState(null);
    setVariantInURL(id, null);
  }

  useEffect(() => {
    setVariantInURL(activeColourId, activeSizeId);
  }, [activeColourId, activeSizeId]);

  function setActiveSizeId(id: string | null): void {
    setActiveSizeIdState(id);
  }

  return { activeColourId, activeSizeId, activeSizes, setActiveColourId, setActiveSizeId };
}
