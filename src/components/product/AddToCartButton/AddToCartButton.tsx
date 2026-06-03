import type { ReactElement } from 'react';
import type { AddToCartButtonProps } from './AddToCartButton.types';
import styles from './AddToCartButton.module.scss';

function getLabel(state: AddToCartButtonProps['state'], isSoldOut: boolean): string {
  if (isSoldOut) return 'Sold Out';
  if (state === 'loading') return 'Adding...';
  if (state === 'success') return 'Added!';
  if (state === 'error') return 'Try Again';
  return 'Add to Cart';
}

export function AddToCartButton({ state, isSoldOut, onClick }: AddToCartButtonProps): ReactElement {
  const isDisabled = isSoldOut || state === 'loading';
  const label = getLabel(state, isSoldOut);

  return (
    <div>
      <button
        className={[
          styles.btn,
          state === 'loading' ? styles['btn--loading'] : '',
          state === 'error' ? styles['btn--error'] : '',
        ].join(' ')}
        onClick={onClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={label}
        aria-busy={state === 'loading'}
      >
        <span>{label}</span>
        {!isSoldOut && state !== 'loading' && state !== 'error' && (
          <span className={`material-symbols-outlined ${styles['btn__icon']}`}>
            shopping_cart
          </span>
        )}
      </button>
      {state === 'error' && (
        <p className={styles['error-msg']} role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
