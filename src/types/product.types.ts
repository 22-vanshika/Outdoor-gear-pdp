export type StockStatus = 'available' | 'low_stock' | 'sold_out';

export interface SizeStock {
  id: string;
  label: string;
  description: string;
  stock: number;
  status: StockStatus;
}

export interface ColourVariant {
  id: string;
  label: string;
  hex: string;
  sizes: SizeStock[];
}

export interface VariantConfig {
  colours: ColourVariant[];
}


export type Size = SizeStock;

interface NormalisedProduct {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  rating: {
    rate: number;
    count: number;
  };
}

export interface EnrichedProduct extends NormalisedProduct {
  brand: string;
  tagline: string;
  variants: VariantConfig;
  isSale: boolean;
  saleDiscount: number;
  titleAccentWord?: string;
}