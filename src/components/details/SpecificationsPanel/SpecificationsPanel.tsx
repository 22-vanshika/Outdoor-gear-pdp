import type { ReactElement } from 'react';
import type { SpecificationsPanelProps } from './SpecificationsPanel.types';
import styles from './SpecificationsPanel.module.scss';

export function SpecificationsPanel({ specs }: SpecificationsPanelProps): ReactElement {
  return (
    <div>
      <div className={styles.grid}>
        {specs.map((spec) => (
          <div key={spec.id} className={styles.cell}>
            <p className={styles['cell__category']}>{spec.category}</p>
            <p className={styles['cell__name']}>{spec.name}</p>
            <p className={styles['cell__value']}>{spec.value}</p>
          </div>
        ))}
      </div>
      <div className={styles.note}>
        <span
          className={`material-symbols-outlined ${styles['note__icon']}`}
          aria-hidden="true"
        >
          info
        </span>
        <p className={styles['note__text']}>
          Specifications measured for 30L standard configuration.
          Dimensions may vary slightly by capacity.
        </p>
      </div>
    </div>
  );
}
