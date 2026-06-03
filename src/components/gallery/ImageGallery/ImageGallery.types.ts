export interface ImageGalleryProps {
  images: string[];
  productName: string;
  activeIndex?: number;
  onSelectIndex?: (index: number) => void;
}