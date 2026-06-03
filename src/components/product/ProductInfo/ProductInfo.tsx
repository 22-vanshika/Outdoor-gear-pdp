import { useState, type ReactElement } from 'react';
import type { ProductInfoProps } from './ProductInfo.types';
import {
  PriceDisplay,
  ColourSwatch,
  SizeSelector,
  QuantityPicker,
  AddToCartButton,
  DeliveryEstimate,
} from '@/components/product';
import type { AddToCartState } from '@/components/product';
import { addToCart } from '@/services';
import { MIN_QUANTITY, MAX_QUANTITY_PER_ORDER } from '@/constants';
import styles from './ProductInfo.module.scss';

export function ProductInfo({ product, activeColourId: propsActiveColourId, onColourChange }: ProductInfoProps): ReactElement {
  const [internalColourId, setInternalColourId] = useState<string>(
    product.variants.colours[0]?.id ?? ''
  );
  const activeColourId = propsActiveColourId !== undefined ? propsActiveColourId : internalColourId;

  const [activeSizeId, setActiveSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(MIN_QUANTITY);
  const [cartState, setCartState] = useState<AddToCartState>('idle');
  const [sizeError, setSizeError] = useState<string | null>(null);

  const activeSize = product.variants.sizes.find((s) => s.id === activeSizeId);
  const isSoldOut = activeSize?.status === 'sold_out';
  const maxQty = Math.min(activeSize?.stock ?? MAX_QUANTITY_PER_ORDER, MAX_QUANTITY_PER_ORDER);

  const handleSelectColour = (colourId: string): void => {
    if (onColourChange) {
      onColourChange(colourId);
    } else {
      setInternalColourId(colourId);
    }
  };

  const handleSelectSize = (sizeId: string): void => {
    setActiveSizeId(sizeId);
    setSizeError(null);
  };

  async function handleAddToCart(): Promise<void> {
    if (!activeSizeId) {
      setSizeError('Please select a volume option');
      return;
    }
    if (isSoldOut) return;
    setSizeError(null);
    setCartState('loading');
    try {
      await addToCart({
        productId: product.id,
        colourId: activeColourId,
        sizeId: activeSizeId,
        quantity,
      });
      setCartState('success');
    } catch {
      setCartState('error');
    } finally {
      setTimeout(() => setCartState('idle'), 2000);
    }
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
          onSelect={handleSelectColour}
        />
      </div>

      {/* Size section */}
      <div className={styles['size-section']}>
        <SizeSelector
          sizes={product.variants.sizes}
          activeSizeId={activeSizeId}
          onSelect={handleSelectSize}
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
          max={maxQty}
          onChange={setQuantity}
        />
        <AddToCartButton
          state={cartState}
          isSoldOut={isSoldOut}
          onClick={handleAddToCart}
        />
        <DeliveryEstimate />
      </div>

      {/* Mobile Fixed Bottom Bar (hidden on desktop in CSS) */}
      <div className={styles['fixed-bar']}>
        <div className={styles['fixed-bar__qty']}>
          <QuantityPicker
            value={quantity}
            min={MIN_QUANTITY}
            max={maxQty}
            onChange={setQuantity}
            showMaxLabel={false}
          />
        </div>
        <div className={styles['fixed-bar__cta']}>
          <AddToCartButton
            state={cartState}
            isSoldOut={isSoldOut}
            onClick={handleAddToCart}
          />
        </div>
      </div>

    </div>
  );
}
