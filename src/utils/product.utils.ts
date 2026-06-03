import type { FakeStoreProduct } from '@/types/api.types';
import type { EnrichedProduct } from '@/types/product.types';
import type { FullVariantConfig } from '@/data/variantConfig';
import { DEFAULT_VARIANT_CONFIG } from '@/data/variantConfig';

export function enrichProduct(raw: FakeStoreProduct, config: FullVariantConfig | undefined): EnrichedProduct {
  const originalPrice = config
    ? parseFloat((raw.price * (1 + config.override.saleDiscount / 100)).toFixed(2))
    : raw.price;

  return {
    id:             raw.id,
    title:          config?.override.title       ?? raw.title,
    description:    config?.override.description ?? raw.description,
    tagline:        config?.override.tagline      ?? '',
    brand:          config?.override.brand       ?? 'EXTERIOR GEAR',
    price:          raw.price,
    originalPrice,
    image:          raw.image,
    images:         config?.override.images      ?? [raw.image],
    category:       raw.category,
    rating:         raw.rating,
    variants:       config?.variants             ?? DEFAULT_VARIANT_CONFIG,
    isSale:         config?.override.isSale      ?? false,
    saleDiscount:   config?.override.saleDiscount ?? 0,
    titleAccentWord: 'Pack',
  };
}
