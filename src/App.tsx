/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, type ReactElement } from 'react';
import { ImageGallery } from '@/components/gallery';
import { ProductInfo } from '@/components/product';
import { Navbar } from '@/components/layout';
import { useProduct } from '@/hooks';
import styles from './App.module.scss';

function App(): ReactElement {
  const { product, isLoading, error } = useProduct('1');
  const [activeColourId, setActiveColourId] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Initialize once product is loaded
  useEffect(() => {
    if (product?.variants.colours[0]?.id) {
      setActiveColourId(product.variants.colours[0].id);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className={styles['loading-container']}>
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles['error-container']}>
        Error: {error ?? 'Product not found'}
      </div>
    );
  }

  const handleColourChange = (colourId: string) => {
    setActiveColourId(colourId);
    const idx = product.variants.colours.findIndex((c) => c.id === colourId);
    if (idx !== -1 && idx < product.images.length) {
      setActiveImageIndex(idx);
    }
  };

  const handleImageSelect = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles['gallery-col']}>
            <ImageGallery
              images={product.images}
              productName={product.title}
              activeIndex={activeImageIndex}
              onSelectIndex={handleImageSelect}
            />
          </div>
          <div className={styles['info-col']}>
            <ProductInfo
              product={product}
              activeColourId={activeColourId}
              onColourChange={handleColourChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;