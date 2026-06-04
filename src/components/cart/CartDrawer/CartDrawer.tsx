import { useEffect, type ReactElement } from 'react';
import type { CartDrawerProps } from './CartDrawer.types';
import { useCartContext } from '@/stores';
import { formatPrice } from '@/utils';
import { MIN_QUANTITY, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE } from '@/constants';
import styles from './CartDrawer.module.scss';

export function CartDrawer({ isOpen, onClose }: CartDrawerProps): ReactElement {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCartContext();

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles['overlay--visible'] : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`${styles.drawer} ${isOpen ? styles['drawer--open'] : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.header}>
          <span className={styles['header__title']}>
            Cart{' '}
            <span className={styles['header__count']}>
              ({totalItems})
            </span>
          </span>
          <button
            className={styles['close-btn']}
            onClick={onClose}
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span
              className={`material-symbols-outlined ${styles['empty__icon']}`}
              aria-hidden="true"
            >
              shopping_bag
            </span>
            <p className={styles['empty__text']}>Your cart is empty</p>
          </div>
        ) : (
          <div className={styles.items}>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.colourId}-${item.sizeId}`}
                className={styles.item}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles['item__image']}
                  width={72}
                  height={72}
                />
                <div className={styles['item__details']}>
                  <span className={styles['item__title']}>{item.title}</span>
                  <span className={styles['item__variant']}>
                    {item.colourId.replace(/-/g, ' ')} / {item.sizeId.toUpperCase()}
                  </span>
                  <div className={styles['item__bottom']}>
                    <span className={styles['item__price']}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <div className={styles['item__actions']}>
                      <button
                        className={styles['qty-btn']}
                        onClick={() =>
                          updateQuantity(item.productId, item.colourId, item.sizeId, item.quantity - 1)
                        }
                        disabled={item.quantity <= MIN_QUANTITY}
                        aria-label="Decrease quantity"
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">remove</span>
                      </button>
                      <span className={styles['qty-value']}>{item.quantity}</span>
                      <button
                        className={styles['qty-btn']}
                        onClick={() =>
                          updateQuantity(item.productId, item.colourId, item.sizeId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxQuantity}
                        aria-label="Increase quantity"
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">add</span>
                      </button>
                      <button
                        className={styles['remove-btn']}
                        onClick={() =>
                          removeItem(item.productId, item.colourId, item.sizeId)
                        }
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles['summary-row']}>
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className={styles['summary-row']}>
              <span>Shipping</span>
              <span>
                {totalPrice >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatPrice(FLAT_SHIPPING_RATE)}
              </span>
            </div>
            <div className={`${styles['summary-row']} ${styles['summary-row--total']}`}>
              <span>Total</span>
              <span>
                {formatPrice(totalPrice >= FREE_SHIPPING_THRESHOLD ? totalPrice : totalPrice + FLAT_SHIPPING_RATE)}
              </span>
            </div>
            <button className={styles['checkout-btn']}>
              Proceed to Checkout
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className={styles['continue-btn']} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
