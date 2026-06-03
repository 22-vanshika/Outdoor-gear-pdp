export type StockStatus = 'available' | 'low_stock' | 'sold_out';

export interface Colour {
  id: string;
  label: string;
  hex: string;
}

export interface Size {
  id: string;
  label: string;
  description: string;
  stock: number;
  status: StockStatus;
}

export interface VariantConfig {
  colours: Colour[];
  sizes: Size[];
}

export interface NormalisedProduct {
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