import { useState, useCallback } from 'react';

interface UseImageGalleryReturn {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  activeImage: string;
}

export function useImageGallery(images: string[]): UseImageGalleryReturn {
  const [activeIndex, setActiveIndexState] = useState<number>(0);

  const setActiveIndex = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setActiveIndexState(index);
    }
  }, [images.length]);

  return {
    activeIndex,
    setActiveIndex,
    activeImage: images[activeIndex] ?? '',
  };
}