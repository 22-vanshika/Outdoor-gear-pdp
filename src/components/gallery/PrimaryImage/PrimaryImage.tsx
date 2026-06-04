import { useRef, useCallback, type ReactElement } from 'react';
import type { PrimaryImageProps } from './PrimaryImage.types';
import styles from './PrimaryImage.module.scss';

export function PrimaryImage({ src, alt }: PrimaryImageProps): ReactElement {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
    imageRef.current.style.transform = 'scale(1.4)';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = 'scale(1)';
  }, []);

  return (
    <div
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={styles.image}
        width={600}
        height={600}
        fetchPriority="high"
      />
    </div>
  );
}