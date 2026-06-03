import type { FakeStoreProduct } from '@/types/api.types';
import type { EnrichedProduct } from '@/types/product.types';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import { VARIANT_CONFIG } from '@/data/variantConfig';
import { enrichProduct } from '@/utils';

export async function fetchProductById(id: string): Promise<EnrichedProduct> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCT_BY_ID(id)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.status}`);
  }
  const raw: FakeStoreProduct = await response.json();
  return enrichProduct(raw, VARIANT_CONFIG[raw.id]);
}
