import { useState, type ReactElement } from 'react';
import { ImageGallery } from '@/components/gallery';
import { ProductInfo } from '@/components/product';
import { Navbar } from '@/components/layout';
import { CartDrawer } from '@/components/cart';
import { useCartContext } from '@/stores';
import { useProduct } from '@/hooks';
import styles from './App.module.scss';

function App(): ReactElement {
  const { isCartOpen, closeCart } = useCartContext();
  const { product, isLoading, error } = useProduct('1');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

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
            />
          </div>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}

export default App;