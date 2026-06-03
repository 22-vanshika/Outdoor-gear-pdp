import { useState, useEffect } from 'react';
import type { Colour, Size } from '@/types';
import { getInitialColour, getInitialSize, setVariantInURL } from '@/utils';

interface UseVariantReturn {
  activeColourId: string;
  activeSizeId: string | null;
  setActiveColourId: (id: string) => void;
  setActiveSizeId: (id: string | null) => void;
}

export function useVariant(colours: Colour[], sizes: Size[]): UseVariantReturn {
  const [activeColourId, setActiveColourIdState] = useState<string>(
    () => getInitialColour(colours)
  );
  const [activeSizeId, setActiveSizeIdState] = useState<string | null>(
    () => getInitialSize(sizes)
  );

  // Sync URL whenever variant changes
  useEffect(() => {
    setVariantInURL(activeColourId, activeSizeId);
  }, [activeColourId, activeSizeId]);

  function setActiveColourId(id: string): void {
    setActiveColourIdState(id);
  }

  function setActiveSizeId(id: string | null): void {
    setActiveSizeIdState(id);
  }

  return { activeColourId, activeSizeId, setActiveColourId, setActiveSizeId };
}
