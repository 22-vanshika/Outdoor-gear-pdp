import { useRef, useEffect, useCallback, type ReactElement } from 'react';
import type { ThumbnailStripProps } from './ThumbnailStrip.types';
import { MOBILE_BREAKPOINT_PX } from '@/constants';
import styles from './ThumbnailStrip.module.scss';

export function ThumbnailStrip({ images, activeIndex, onSelect }: ThumbnailStripProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync scroll position with activeIndex on mobile
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT_PX;
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
    
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT_PX;
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
              src={src.replace('w=800', 'w=200')}
              alt={`Product thumbnail ${index + 1}`}
              className={styles.thumbnail__image}
              width={80}
              height={80}
            />
          </button>
        ))}
      </div>

      {/* Navigation and dots position indicator (mobile only) */}
      <div className={styles.navigation}>
        <button 
          className={styles.arrow}
          onClick={() => onSelect(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous image"
        >
          <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
        </button>

        <div className={styles.dots} aria-hidden="true">
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${activeIndex === index ? styles['dot--active'] : ''}`}
            />
          ))}
        </div>

        <button 
          className={styles.arrow}
          onClick={() => onSelect(Math.min(images.length - 1, activeIndex + 1))}
          disabled={activeIndex === images.length - 1}
          aria-label="Next image"
        >
          <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        </button>
      </div>
    </div>
  );
}