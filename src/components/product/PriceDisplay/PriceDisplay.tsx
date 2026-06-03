import type { ReactElement } from 'react';
import type { PriceDisplayProps } from './PriceDisplay.types';
import styles from './PriceDisplay.module.scss';

import { formatPrice } from '@/utils';

export function PriceDisplay({
  price,
  originalPrice,
  isSale = false,
  saleDiscount,
}: PriceDisplayProps): ReactElement {
  return (
    <div className={styles.wrapper}>
      <span className={styles.price}>{formatPrice(price)}</span>
      {isSale && originalPrice && (
        <div className={styles['sale-row']}>
          <span className={styles.original}>{formatPrice(originalPrice)}</span>
          {saleDiscount && (
            <span className={styles['discount-badge']}>{saleDiscount}% OFF</span>
          )}
        </div>
      )}
    </div>
  );
}
