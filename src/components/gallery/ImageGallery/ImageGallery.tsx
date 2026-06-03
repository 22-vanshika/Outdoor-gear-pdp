import { type ReactElement } from 'react';
import { PrimaryImage } from '../PrimaryImage';
import { ThumbnailStrip } from '../ThumbnailStrip';
import { useImageGallery } from '@/hooks';
import type { ImageGalleryProps } from './ImageGallery.types';
import styles from './ImageGallery.module.scss';

export function ImageGallery({ images, productName, activeIndex: propsActiveIndex, onSelectIndex }: ImageGalleryProps): ReactElement {
  const { activeIndex: internalActiveIndex, setActiveIndex: setInternalActiveIndex, activeImage } = useImageGallery(images);

  const activeIndex = propsActiveIndex !== undefined ? propsActiveIndex : internalActiveIndex;
  const setActiveIndex = onSelectIndex !== undefined ? onSelectIndex : setInternalActiveIndex;
  const currentImage = images[activeIndex] ?? activeImage;

  return (
    <div className={styles.gallery}>
      <div className={styles['primary-wrapper']}>
        <PrimaryImage
          src={currentImage}
          alt={`${productName} — image ${activeIndex + 1} of ${images.length}`}
        />

        {/* Desktop: bottom-left series badge */}
        <div className={styles['badge-series']} aria-hidden="true">
          <span className={`material-symbols-outlined ${styles['badge-series__icon']}`}>
            verified
          </span>
          <span className={styles['badge-series__label']}>Technical Series 01</span>
        </div>

        {/* Desktop only: floating icon badge right side */}
        <div className={styles['badge-float']} aria-hidden="true">
            <span className={`material-symbols-outlined ${styles['badge-float__icon']}`}>
                storm
            </span>
        </div>

        {/* Mobile only: vertical label top-left */}
        <div className={styles['badge-vertical']} aria-hidden="true">
          <span className={styles['badge-vertical__text']}>Technical Series 01</span>
        </div>

        {/* Both: rotating circular text top-right */}
        <div className={styles['badge-circular']} aria-hidden="true">
          <div className={styles['badge-circular__ring']}>
            <svg viewBox="0 0 100 100" className={styles['badge-circular__svg']}>
              <path
                id="circlePathDesktop"
                d="M 50,50 m -48,0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
                fill="none"
              />
              <path
                id="circlePathMobile"
                d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                fill="none"
              />
              <text className={`${styles['badge-circular__text']} ${styles['badge-circular__text--desktop']}`}>
                <textPath href="#circlePathDesktop">
                  BUILT FOR THE ELEMENTS • PROFESSIONAL GRADE •
                </textPath>
              </text>
              <text className={`${styles['badge-circular__text']} ${styles['badge-circular__text--mobile']}`}>
                <textPath href="#circlePathMobile">
                  BUILT FOR THE ELEMENTS • PROFESSIONAL GRADE •
                </textPath>
              </text>
            </svg>
            {/* Mobile: show icon in center, Desktop: hide */}
            <span
              className={`material-symbols-outlined ${styles['badge-circular__center-icon']}`}
            >
              landscape
            </span>
          </div>
        </div>

      </div>
      <ThumbnailStrip
        images={images}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
    </div>
  );
}