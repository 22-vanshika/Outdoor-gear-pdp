import type { VariantConfig } from '@/types';
import { deriveStockStatus } from '@/utils';

interface ProductOverride {
  title: string;
  brand: string;
  description: string;
  tagline: string;
  images: string[];
  isSale: boolean;
  saleDiscount: number;
}

export interface FullVariantConfig {
  override: ProductOverride;
  variants: VariantConfig;
}

export const VARIANT_CONFIG: Record<number, FullVariantConfig> = {
  1: {
    override: {
      title: 'Alpine Ascent Pack',
      brand: 'EXTERIOR GEAR',
      tagline: 'Modular engineering for the high-alpine environment.',
      description: 'Engineered for the high-altitude pursuit, the Alpine Ascent Pack blends ultra-durable 1000D Cordura with a revolutionary ergonomic harness. Designed to withstand extreme elements while maintaining a sleek, minimalist profile.',
      isSale: true,
      saleDiscount: 20,
      images: [
        'https://images.unsplash.com/photo-1621624959365-071359461b94?q=60&w=800&auto=format&fit=crop&fm=webp&ixlib=rb-4.1.0',
        'https://images.unsplash.com/photo-1495745190033-64f95ea0d02f?q=60&w=800&auto=format&fit=crop&fm=webp&ixlib=rb-4.1.0',
        'https://images.unsplash.com/photo-1557160836-f3a6d1afaab2?q=60&w=800&auto=format&fit=crop&fm=webp&ixlib=rb-4.1.0',
        'https://images.unsplash.com/photo-1643901947958-fdd7dd3ff77a?q=60&w=800&auto=format&fit=crop&fm=webp&ixlib=rb-4.1.0',
        'https://images.unsplash.com/photo-1622260615656-96d7c7ad6c4c?q=60&w=800&auto=format&fit=crop&fm=webp&ixlib=rb-4.1.0'
      ],
    },
    variants: {
      colours: [
        {
          id: 'slate-blue',
          label: 'Slate Blue',
          hex: '#5D707F',
          sizes: [
            { id: '15l', label: '15L', description: 'Ultralight', stock: 0, status: deriveStockStatus(0) },
            { id: '20l', label: '20L', description: 'Standard',   stock: 6, status: deriveStockStatus(6) },
            { id: '30l', label: '30L', description: 'Extended',   stock: 2, status: deriveStockStatus(2) },
            { id: '40l', label: '40L', description: 'Expedition', stock: 0, status: deriveStockStatus(0) },
            { id: '50l', label: '50L', description: 'Max Load',   stock: 4, status: deriveStockStatus(4) },
          ],
        },
        {
          id: 'rust-orange',
          label: 'Rust Orange',
          hex: '#B35E33',
          sizes: [
            { id: '15l', label: '15L', description: 'Ultralight', stock: 6, status: deriveStockStatus(6) },
            { id: '20l', label: '20L', description: 'Standard',   stock: 8, status: deriveStockStatus(8) },
            { id: '30l', label: '30L', description: 'Extended',   stock: 5, status: deriveStockStatus(5) },
            { id: '40l', label: '40L', description: 'Expedition', stock: 7, status: deriveStockStatus(7) },
            { id: '50l', label: '50L', description: 'Max Load',   stock: 4, status: deriveStockStatus(4) },
          ],
        },
        {
          id: 'obsidian-black',
          label: 'Obsidian Black',
          hex: '#1A1C1E',
          sizes: [
            { id: '15l', label: '15L', description: 'Ultralight', stock: 3, status: deriveStockStatus(3) },
            { id: '20l', label: '20L', description: 'Standard',   stock: 5, status: deriveStockStatus(5) },
            { id: '30l', label: '30L', description: 'Extended',   stock: 0, status: deriveStockStatus(0) },
            { id: '40l', label: '40L', description: 'Expedition', stock: 0, status: deriveStockStatus(0) },
            { id: '50l', label: '50L', description: 'Max Load',   stock: 0, status: deriveStockStatus(0) },
          ],
        },
      ],
    },
  },
};

export const DEFAULT_VARIANT_CONFIG: VariantConfig = {
  colours: [
    { 
      id: 'default', 
      label: 'Default', 
      hex: '#8b4a32',
      sizes: [
        { id: 'one-size', label: 'One Size', description: 'Standard', stock: 5, status: deriveStockStatus(5) },
      ]
    },
  ],
};
