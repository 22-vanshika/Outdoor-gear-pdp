import { useState, useEffect, type ReactElement } from 'react';
import type { ProductInfoProps } from './ProductInfo.types';
import {
  PriceDisplay,
  ColourSwatch,
  SizeSelector,
  QuantityPicker,
  AddToCartButton,
  DeliveryEstimate,
} from '@/components/product';
import { MIN_QUANTITY, MAX_QUANTITY_PER_ORDER } from '@/constants';
import styles from './ProductInfo.module.scss';
import { useCart, useVariant } from '@/hooks';

export function ProductInfo({ product }: ProductInfoProps): ReactElement {
  const { activeColourId, activeSizeId, setActiveColourId, setActiveSizeId } =
    useVariant(product.variants.colours, product.variants.sizes);

  const [quantity, setQuantity] = useState<number>(MIN_QUANTITY);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const { cartState, handleAddToCart, items } = useCart();

  const activeSize = product.variants.sizes.find((s) => s.id === activeSizeId);
  const isSoldOut = activeSize?.status === 'sold_out' || !activeSizeId;
  const cartQuantity = items.find(
    (i) =>
      i.productId === product.id &&
      i.colourId === activeColourId &&
      i.sizeId === activeSizeId
  )?.quantity ?? 0;

  const stockAvailable = activeSize?.stock ?? 0;
  const maxQty = Math.min(stockAvailable, MAX_QUANTITY_PER_ORDER);
  const remainingQty = maxQty - cartQuantity;
  const isMaxedOut = cartQuantity >= maxQty && !isSoldOut;

  useEffect(() => {
    if (quantity > remainingQty && remainingQty > 0) {
      setQuantity(remainingQty);
    }
  }, [remainingQty, quantity]);

  function handleSizeSelect(id: string): void {
    setActiveSizeId(id);
    setQuantity(MIN_QUANTITY);
    setSizeError(null);
  }

  async function onAddToCart(): Promise<void> {
    if (!activeSizeId) {
      setSizeError('Please select a volume option');
      return;
    }
    if (isMaxedOut) return;
    setSizeError(null);
    await handleAddToCart(product, activeColourId, activeSizeId, quantity);
  }

  const renderTitle = (): ReactElement => {
    const accentWord = product.titleAccentWord ?? 'Pack';
    const parts = product.title.split(' ');
    return (
      <h1 className={styles.title}>
        {parts.map((part, index) => {
          const cleanPart = part.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const cleanAccent = accentWord.toLowerCase();
          if (cleanPart === cleanAccent) {
            return (
              <span key={index} className={styles.title__accent}>
                {part}{index < parts.length - 1 ? ' ' : ''}
              </span>
            );
          }
          return <span key={index}>{part}{index < parts.length - 1 ? ' ' : ''}</span>;
        })}
      </h1>
    );
  };

  return (
    <div className={styles.panel}>

      {/* Breadcrumb — desktop only */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <a href="#">Equipment</a>
        <span className={styles['breadcrumb__sep']} aria-hidden="true">&rsaquo;</span>
        <span aria-current="page">Backpacks</span>
      </nav>

      {/* Series badge */}
      <div className={styles.meta}>
        <span className={styles['badge-series']}>Technical Series 01</span>
        <span className={styles['badge-year']}>Est. 2024</span>
      </div>

      {/* Title */}
      {renderTitle()}

      {/* Price + tagline */}
      <div className={styles['price-row']}>
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          isSale={product.isSale}
          saleDiscount={product.saleDiscount}
        />
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.tagline}>
          {product.tagline}
        </p>
      </div>

      {/* Selection label */}
      <p className={styles['selection-label']}>Selection</p>

      {/* Colour section */}
      <div className={styles['colour-section']}>
        <ColourSwatch
          colours={product.variants.colours}
          activeColourId={activeColourId}
          onSelect={setActiveColourId}
        />
      </div>

      {/* Size section */}
      <div className={styles['size-section']}>
        <SizeSelector
          sizes={product.variants.sizes}
          activeSizeId={activeSizeId}
          onSelect={handleSizeSelect}
        />
        {sizeError && (
          <p className={styles['size-error']} role="alert">{sizeError}</p>
        )}
      </div>

      {/* Inline actions — desktop only */}
      <div className={styles['inline-actions']}>
        <QuantityPicker
          value={quantity}
          min={MIN_QUANTITY}
          max={remainingQty}
          onChange={setQuantity}
        />
        <AddToCartButton
          state={cartState}
          isSoldOut={isSoldOut}
          isMaxedOut={isMaxedOut}
          onClick={onAddToCart}
        />
        <DeliveryEstimate />
      </div>

      {/* Mobile Fixed Bottom Bar (hidden on desktop in CSS) */}
      <div className={styles['fixed-bar']}>
        <div className={styles['fixed-bar__qty']}>
          <QuantityPicker
            value={quantity}
            min={MIN_QUANTITY}
            max={remainingQty}
            onChange={setQuantity}
            showMaxLabel={false}
          />
        </div>
        <div className={styles['fixed-bar__cta']}>
          <AddToCartButton
            state={cartState}
            isSoldOut={isSoldOut}
            isMaxedOut={isMaxedOut}
            onClick={onAddToCart}
          />
        </div>
      </div>

    </div>
  );
}
