import type { ReactElement } from 'react';
import type { SizeSelectorProps } from './SizeSelector.types';
import type { StockStatus } from '@/types';
import styles from './SizeSelector.module.scss';

function getStatusLabel(status: StockStatus, stock: number): string {
  if (status === 'sold_out') return 'Sold Out';
  if (status === 'low_stock') return `Only ${stock} left`;
  return '';
}

export function SizeSelector({ sizes, activeSizeId, onSelect }: SizeSelectorProps): ReactElement {
  return (
    <div>
      <div className={styles.header}>
        <span className={styles.label}>Volume Selection</span>
        <span className={styles['sizing-guide']} aria-hidden="true">Sizing Guide</span>
      </div>
      <div className={styles.grid} role="group" aria-label="Volume options">
        {sizes.map((size) => {
          const isSoldOut = size.status === 'sold_out';
          const isActive = activeSizeId === size.id;
          const statusLabel = getStatusLabel(size.status, size.stock);

          return (
            <button
              key={size.id}
              className={[
                styles['size-btn'],
                isActive ? styles['size-btn--active'] : '',
                isSoldOut ? styles['size-btn--sold-out'] : '',
                (!isActive && size.status === 'low_stock') ? styles['size-btn--low-stock'] : '',
              ].join(' ')}
              onClick={() => !isSoldOut && onSelect(size.id)}
              disabled={isSoldOut}
              aria-disabled={isSoldOut}
              aria-pressed={isActive}
              aria-label={`${size.label}${statusLabel ? ` — ${statusLabel}` : ''}`}
            >
              <span className={styles['size-btn__label']}>{size.label}</span>
              {statusLabel && (
                <span className={`${styles['size-btn__status']} ${styles[`size-btn__status--${size.status}`]}`}>
                  {statusLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
