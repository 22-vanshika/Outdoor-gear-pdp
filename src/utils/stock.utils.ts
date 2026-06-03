import type { StockStatus } from '@/types';
import { LOW_STOCK_THRESHOLD } from '@/constants';

export function deriveStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'sold_out';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low_stock';
  return 'available';
}
