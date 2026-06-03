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

// Keep Colour and Size as aliases for backwards compat in components
export type Colour = Pick<ColourVariant, 'id' | 'label' | 'hex'>;
export type Size = SizeStock;

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