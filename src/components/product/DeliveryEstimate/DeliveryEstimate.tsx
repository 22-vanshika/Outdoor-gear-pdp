import type { ReactElement } from 'react';
import type { DeliveryEstimateProps } from './DeliveryEstimate.types';
import styles from './DeliveryEstimate.module.scss';

export function DeliveryEstimate({
  estimateText = 'Estimated Delivery: June 12 – June 15',
  shippingText = 'Free worldwide shipping on orders over $250.',
}: DeliveryEstimateProps): ReactElement {
  return (
    <div className={styles.strip}>
      <span className={`material-symbols-outlined ${styles.icon}`}>
        local_shipping
      </span>
      <div className={styles.text}>
        <span className={styles['text__estimate']}>
          {estimateText}
        </span>
        <span className={styles['text__shipping']}>
          {shippingText}
        </span>
      </div>
    </div>
  );
}
