import { useRef, useEffect, useCallback } from 'react';
import type { ThumbnailStripProps } from './ThumbnailStrip.types';
import styles from './ThumbnailStrip.module.scss';

export function ThumbnailStrip({ images, activeIndex, onSelect }: ThumbnailStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync scroll position with activeIndex on mobile
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const isMobile = window.innerWidth <= 767;
    if (!isMobile) return;

    const thumbnailWidth = 80; // $thumbnail-size
    const gap = 12; // $spacing-sm
    const targetScrollLeft = activeIndex * (thumbnailWidth + gap);

    if (Math.abs(container.scrollLeft - targetScrollLeft) > 5) {
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  // Update activeIndex based on scroll position on mobile
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const isMobile = window.innerWidth <= 767;
    if (!isMobile) return;

    const thumbnailWidth = 80; // $thumbnail-size
    const gap = 12; // $spacing-sm
    const scrollLeft = container.scrollLeft;
    
    const index = Math.round(scrollLeft / (thumbnailWidth + gap));
    if (index >= 0 && index < images.length && index !== activeIndex) {
      onSelect(index);
    }
  }, [activeIndex, images.length, onSelect]);

  return (
    <div className={styles.wrapper}>
      <div
        ref={containerRef}
        className={styles.strip}
        role="list"
        aria-label="Product image thumbnails"
        onScroll={handleScroll}
      >
        {images.map((src, index) => (
          <button
            key={src}
            role="listitem"
            className={`${styles.thumbnail} ${activeIndex === index ? styles['thumbnail--active'] : ''}`}
            onClick={() => onSelect(index)}
            aria-label={`View image ${index + 1}`}
            aria-pressed={activeIndex === index}
          >
            <img
              src={src}
              alt={`Product thumbnail ${index + 1}`}
              className={styles.thumbnail__image}
              width={80}
              height={80}
            />
          </button>
        ))}
      </div>

      {/* Dots position indicator (mobile only) */}
      <div className={styles.dots} aria-hidden="true">
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${activeIndex === index ? styles['dot--active'] : ''}`}
            onClick={() => onSelect(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}