import type { ReactElement } from 'react';
import type { QuantityPickerProps } from './QuantityPicker.types';
import styles from './QuantityPicker.module.scss';

export function QuantityPicker({ value, min, max, onChange, showMaxLabel = true }: QuantityPickerProps): ReactElement {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.picker}
        role="group"
        aria-label="Quantity"
      >
        <button
          className={styles.btn}
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label="Decrease quantity"
        >
          <span className={`material-symbols-outlined ${styles['btn__icon']}`} aria-hidden="true">
            remove
          </span>
        </button>
        <span
          className={styles.value}
          aria-label={`Quantity: ${value}`}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          role="spinbutton"
        >
          {value}
        </span>
        <button
          className={styles.btn}
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          <span className={`material-symbols-outlined ${styles['btn__icon']}`} aria-hidden="true">
            add
          </span>
        </button>
      </div>
      {showMaxLabel && (
        <span className={styles['max-label']}>Max. {max} per order</span>
      )}
    </div>
  );
}
